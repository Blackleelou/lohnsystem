const authProvider = {
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
    } catch (error) {
      return Promise.reject();
    }
  },
  getPermissions: async () => {
    try {
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      return Promise.resolve(session?.user?.role || 'guest');
    } catch {
      return Promise.resolve('guest');
    }
  },
  getIdentity: async () => {
    try {
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      if (session?.user) {
        return {
          id: session.user.email,
          fullName: session.user.name || session.user.email,
          avatar: session.user.image || undefined,
        };
      }
      return null;
    } catch {
      return null;
    }
  },
};

export default authProvider;
