import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      companyId?: string | null;
      role?: 'admin' | 'editor' | 'viewer';
      isAdmin?: boolean;
      nickname?: string;
      promotedToAdmin?: boolean;
      name?: string;
      showName?: boolean;
      showNickname?: boolean;
      showEmail?: boolean;
    };
  }

  interface User {
    promotedToAdmin?: boolean;
    showName?: boolean;
    showNickname?: boolean;
    showEmail?: boolean;
  }
}
