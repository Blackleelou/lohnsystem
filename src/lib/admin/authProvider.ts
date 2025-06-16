// src/lib/admin/authProvider.ts
import { AuthProvider, UserIdentity } from 'react-admin';

const authProvider: AuthProvider = {
  login: () => {
    window.location.href = '/api/auth/signin';
    return Promise.resolve();
  },

  logout: () => {
    window.location.href = '/api/auth/signout';
    return Promise.resolve();
  },

  checkAuth: async () => {
    const res = await fetch('/api/auth/session');
    const session = await res.json();
    return session?.user ? Promise.resolve() : Promise.reject();
  },

  checkError: async (error) => {
    return error?.status === 401 || error?.status === 403
      ? Promise.reject()
      : Promise.resolve();
  },

  getPermissions: async () => {
    try {
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      return session?.user?.role ?? 'guest';
    } catch {
      return 'guest';
    }
  },

  getIdentity: async (): Promise<UserIdentity> => {
    const res = await fetch('/api/auth/session');
    const session = await res.json();

    if (session?.user) {
      return {
        id: session.user.email,
        fullName: session.user.name ?? session.user.email,
        avatar: session.user.image ?? undefined,
      };
    }

    return Promise.reject();
  },
};

export default authProvider;
