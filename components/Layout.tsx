import React from 'react';
import MobileMenu from './MobileMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
        <MobileMenu />
      </header>
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}