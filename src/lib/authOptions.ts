import { AuthOptions } from "next-auth";
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
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id, email: user.email };
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
      const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
      if (dbUser) {
        token.id = dbUser.id;
        token.email = dbUser.email;
        token.companyId = dbUser.companyId;
        token.role = dbUser.role;
        token.isAdmin = dbUser.isAdmin;
      }
    }
    // **Kein trigger === "session" mehr!**
    if (trigger === "update" && token.email) {
      const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
      if (dbUser) {
        token.companyId = dbUser.companyId;
        token.role = dbUser.role;
        token.isAdmin = dbUser.isAdmin;
      }
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.companyId = token.companyId as string | null;
      session.user.role = token.role as "admin" | "editor" | "viewer";
      session.user.isAdmin = typeof token.isAdmin === "boolean" ? token.isAdmin : undefined;
    }
    return session;
  },
},
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
