// src/lib/authOptions.ts

import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-Mail", type: "text" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // Benutzer aus der DB holen
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        // Wir geben hier nur die nötigsten Felder zurück – 
        // weitere Infos (companyId, role, isAdmin, nickname) landen im JWT‐Callback.
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

  // Wir arbeiten mit JSON Web Tokens als Session‐Strategie
  session: { strategy: "jwt" },

  callbacks: {
    // ‼️ Wird beim ersten Login (Credentials oder Google) und bei jedem `session.update()` aufgerufen.
    async jwt({ token, user, trigger }) {
      // 1) Erstes Login: user ist gesetzt
      if (user && user.email) {
        // Vollständige User‐Daten (inkl. companyId, role, isAdmin, nickname) aus der DB holen
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: {
            id: true,
            email: true,
            companyId: true,
            role: true,
            isAdmin: true,
            nickname: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.companyId = dbUser.companyId;
          token.role = dbUser.role;
          token.isAdmin = dbUser.isAdmin;
          token.nickname = dbUser.nickname;
        }
      }

      // 2) Trigger "update": Manuelles Session‐Update (z. B. session.update()) will erneute Werte nachladen
      if (trigger === "update" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: {
            companyId: true,
            role: true,
            isAdmin: true,
            nickname: true,
          },
        });
        if (dbUser) {
          token.companyId = dbUser.companyId;
          token.role = dbUser.role;
          token.isAdmin = dbUser.isAdmin;
          token.nickname = dbUser.nickname;
        }
      }

      return token;
    },

    // Wird bei jedem Aufruf von getSession()/useSession() (Client‐Seite) aufgerufen.
    // Wir übernehmen hier die im JWT gespeicherten Werte in session.user.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.companyId = token.companyId as string | null;
        session.user.role = token.role as "admin" | "editor" | "viewer";
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.nickname = token.nickname as string | null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
