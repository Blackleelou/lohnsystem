import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  const router = useRouter();

  const toggleMenu = () => setOpen(!open);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
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
          zIndex: 10
        }}>
          <div style={{ marginBottom: 10, cursor: 'pointer' }} onClick={() => changeLanguage('de')}>🇩🇪 Deutsch</div>
          <div style={{ marginBottom: 10, cursor: 'pointer' }} onClick={() => changeLanguage('en')}>🇬🇧 English</div>
          <div style={{ cursor: 'pointer', color: 'red' }} onClick={logout}>Logout</div>
        </div>
      )}
    </div>
  );
}