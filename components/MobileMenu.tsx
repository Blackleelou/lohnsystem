import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

const MobileMenu: React.FC = () => {
  if (typeof window === 'undefined') return null;
  const { data: session } = useSession() || {};
  const { i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = i18n.language || 'de';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    closeMenu();
  };

  const menuItems = (
    <nav style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 12 : 20,
      alignItems: isMobile ? 'flex-start' : 'center',
      padding: isMobile ? 20 : 0
    }}>
      <Link href="/dashboard" onClick={closeMenu}>Dashboard</Link>
      <Link href="/auswertung" onClick={closeMenu}>Auswertung</Link>
      <Link href="/settings" onClick={closeMenu}>Einstellungen</Link>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <img src="/flags/de.png" alt="Deutsch" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={() => changeLanguage('de')} />
        <img src="/flags/gb.png" alt="English" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={() => changeLanguage('en')} />
      </div>
      <button onClick={() => signOut()} style={{
        background: 'none', border: 'none', padding: 0,
        cursor: 'pointer', color: 'red'
      }}>Logout</button>
    </nav>
  );

  return (
    <div>
      {isMobile ? (
        <>
          <div onClick={toggleMenu} style={{ fontSize: 24, cursor: 'pointer' }}>≡</div>
          {isOpen && (
            <div style={{
              position: 'absolute',
              top: 50,
              right: 10,
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 1000
            }}>
              {menuItems}
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', gap: 20 }}>{menuItems}</div>
      )}
    </div>
  );
};

export default MobileMenu;