import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

const MobileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const changeLanguage = (lang: string) => {
    router.push(router.pathname, router.asPath, { locale: lang });
    setMenuOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={toggleMenu}
        style={{
          backgroundColor: '#f0f0f0',
          borderRadius: '50%',
          border: 'none',
          padding: '10px',
          cursor: 'pointer'
        }}
        aria-label="Menü öffnen"
      >
        <span style={{ fontSize: '24px' }}>≡</span>
      </button>
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          marginTop: '8px',
          zIndex: 1000,
          minWidth: '150px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          <div
            onClick={() => signOut()}
            style={{ color: 'red', cursor: 'pointer', marginBottom: '10px' }}
          >
            Logout
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => changeLanguage('de')}>🇩🇪</span>
            <span style={{ cursor: 'pointer' }} onClick={() => changeLanguage('en')}>🇬🇧</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;