// src/lib/admin/authProvider.ts
import { AuthProvider } from 'react-admin';

const authProvider: AuthProvider = {
  login: async () => {
    window.location.href = '/api/auth/signin';
    return Promise.resolve();
  },

  logout: async () => {
    window.location.href = '/api/auth/signout';
    return Promise.resolve();
  },

  checkAuth: async () => {
    try {
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      return session?.user ? Promise.resolve() : Promise.reject();
    } catch {
      return Promise.reject();
    }
  },

  // <<< fehlte bisher
  checkError: async (error) => {
    // Bei 401/403 → abmelden, sonst ignorieren
    if (error?.status === 401 || error?.status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
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

  getIdentity: async () => {
    try {
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      if (session?.user) {
        return {
          id: session.user.email,
          fullName: session.user.name ?? session.user.email,
          avatar: session.user.image ?? undefined,
        };
      }
      return null;
    } catch {
      return null;
    }
  },
};

export default authProvider;
