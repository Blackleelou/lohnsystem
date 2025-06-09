import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-Mail", type: "text" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            email: true,
            companyId: true,
            role: true,
            isAdmin: true,
            nickname: true,
            name: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.companyId = dbUser.companyId;
          token.role = dbUser.role;
          token.isAdmin = dbUser.isAdmin;
          token.nickname = dbUser.nickname;
          token.name = dbUser.name;
        }
      }

      if (trigger === "update" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: {
            companyId: true,
            role: true,
            isAdmin: true,
            nickname: true,
            name: true,
          },
        });
        if (dbUser) {
          token.companyId = dbUser.companyId;
          token.role = dbUser.role;
          token.isAdmin = dbUser.isAdmin;
          token.nickname = dbUser.nickname;
          token.name = dbUser.name;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.companyId = token.companyId as string | null;
        session.user.role = token.role as "admin" | "editor" | "viewer";
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.nickname = (token.nickname as string | null) ?? undefined;
        session.user.name = token.name as string | undefined;
      }
      return session;
    },
  },

  events: {
    async signIn({ user }) {
      if (!user?.email) return;
      try {
        await prisma.user.update({
          where: { email: user.email },
          data: { lastLogin: new Date() },
        });
      } catch (err) {
        console.error("Fehler beim Aktualisieren von lastLogin:", err);
      }
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
