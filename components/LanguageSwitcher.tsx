import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
      style={{ position: 'relative', cursor: 'pointer' }}
    >
      <img
        src={`/flags/${i18n.language === 'de' ? 'de' : 'gb'}.png`}
        alt="Sprache"
        style={{ width: 24, height: 24 }}
      />
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: 5,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 5
        }}>
          <img src="/flags/de.png" alt="Deutsch" style={{ width: 24, height: 24 }} onClick={() => changeLanguage('de')} />
          <img src="/flags/gb.png" alt="English" style={{ width: 24, height: 24 }} onClick={() => changeLanguage('en')} />
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;