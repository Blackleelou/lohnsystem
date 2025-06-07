import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      companyId?: string | null;
      role?: "admin" | "editor" | "viewer";
      isAdmin?: boolean;
      nickname?: string;
      promotedToAdmin?: boolean; // 👈 HIER ERGÄNZT
    };
  }

  interface User {
    promotedToAdmin?: boolean; // Optional, falls du später auch User erweiterst
  }
}
