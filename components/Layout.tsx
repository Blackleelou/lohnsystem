import React from 'react';
import { useSession } from 'next-auth/react';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const sessionData = useSession();
  const session = sessionData?.data;

  return (
    <div style={{ padding: 20 }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {session && <MobileMenu />}
        </div>
        {session && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LanguageSwitcher />
            <UserMenu />
          </div>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;