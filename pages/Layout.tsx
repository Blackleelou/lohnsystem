import React, { useState, useEffect } from 'react';
import i18next from 'i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

const languages = [
  { code: 'de', flag: '/flags/de.png', name: 'Deutsch' },
  { code: 'en', flag: '/flags/gb.png', name: 'English' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = document.cookie.includes("userId=");
    if (userId && router.pathname !== '/login') {
      setIsLoggedIn(true);
    }
  }, [router.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f3f3f3' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #ccc' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
          <span style={{ background: '#eee', padding: '0.5rem 1rem', borderRadius: '6px' }}>LOGO</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div style={{ cursor: 'pointer', fontSize: '1.2rem' }}>🌐</div>
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '0.5rem',
                display: 'flex',
                gap: '0.5rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                zIndex: 100
              }}>
                {languages.map(lang => (
                  <div
                    key={lang.code}
                    onClick={() => i18next.changeLanguage(lang.code)}
                    title={lang.name}
                    style={{ cursor: 'pointer' }}
                  >
                    <Image src={lang.flag} alt={lang.name} width={24} height={24} />
                  </div>
                ))}
              </div>
            )}
          </div>
          {isLoggedIn && router.pathname !== '/login' && (
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div style={{
                border: '2px solid black',
                color: '#000',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                J
              </div>
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  padding: '0.5rem',
                  minWidth: '100px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  zIndex: 100
                }}>
                  <div
                    style={{ cursor: 'pointer', padding: '0.3rem 0.5rem' }}
                    onClick={() => {
                      document.cookie = "userId=; Max-Age=0; Path=/; SameSite=Lax; Secure";
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
      <footer style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', margin: '1rem 0' }}>v0.5.01</footer>
    </div>
  );
}
