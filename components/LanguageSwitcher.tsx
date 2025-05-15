import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = i18n.language || 'de';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{ position: 'relative', cursor: 'pointer' }}
    >
      <img
        src={`/flags/${currentLang === 'de' ? 'de' : 'gb'}.png`}
        alt="Sprache"
        style={{ width: 24, height: 24 }}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 4,
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: 4,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <img
            src="/flags/de.png"
            alt="Deutsch"
            style={{ width: 24, height: 24, marginBottom: 4, cursor: 'pointer' }}
            onClick={() => changeLanguage('de')}
          />
          <img
            src="/flags/gb.png"
            alt="English"
            style={{ width: 24, height: 24, cursor: 'pointer' }}
            onClick={() => changeLanguage('en')}
          />
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;