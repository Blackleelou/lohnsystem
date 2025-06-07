import NextAuth from "next-auth"; 

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      mode?: "solo" | "company";
      role?: "admin" | "editor" | "viewer";
      companyId?: string | null;
      isAdmin?: boolean;
      nickname?: string;
      session.user.promotedToAdmin = user.promotedToAdmin;
    };
  }
}
