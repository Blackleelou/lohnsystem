import React from 'react';
import MobileMenu from './MobileMenu';
import ErrorBoundary from './ErrorBoundary';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <header style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '10px 16px',
          backgroundColor: '#fff'
        }}>
          <MobileMenu />
        </header>
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}