import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signOut } from 'next-auth/react';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();

  const toggleMenu = () => setOpen(!open);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={toggleMenu} style={{ fontSize: 24 }}>≡</button>
      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          padding: 10,
          zIndex: 10,
          minWidth: 120
        }}>
          <div onClick={() => signOut({ callbackUrl: '/' })}
               style={{ cursor: 'pointer', color: 'red', marginBottom: 10 }}>Logout</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => changeLanguage('de')}>🇩🇪</span>
            <span style={{ cursor: 'pointer' }} onClick={() => changeLanguage('en')}>🇬🇧</span>
          </div>
        </div>
      )}
    </div>
  );
}