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
    const res = await fetch('/api/auth/session');
    const session = await res.json();
    return session?.user ? Promise.resolve() : Promise.reject();
  },
  getPermissions: async () => {
    const res = await fetch('/api/auth/session');
    const session = await res.json();
    return session?.user?.role || 'guest';
  },
  getIdentity: async () => {
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
  },
};

export default authProvider;
