import React from 'react';
import MobileMenu from './MobileMenu';
import ErrorBoundary from './ErrorBoundary';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          borderBottom: '1px solid #ccc'
        }}>
          <div />
          <MobileMenu />
        </header>
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}