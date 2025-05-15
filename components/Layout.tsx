import React from 'react';
import { useSession } from 'next-auth/react';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return (
    <div style={{ padding: 20 }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {session && <LanguageSwitcher />}
        </div>
        {session && <UserMenu />}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;