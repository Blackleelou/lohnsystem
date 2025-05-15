"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import UserMenu from "@/components/UserMenu";

const languages = [
  { code: 'de', flag: '/flags/de.png', name: 'Deutsch' },
  { code: 'en', flag: '/flags/gb.png', name: 'English' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookieSet = document.cookie.includes("userId=");
    setIsLoggedIn(cookieSet);
  }, []);

  return (
    <div style={{ margin: 0, fontFamily: "Arial", background: "#f3f3f3", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", background: "#fff", borderBottom: "1px solid #ccc" }}>
        <div style={{ fontWeight: "bold", fontSize: "1.3rem" }}>{t('app.title') || 'Brutto-Netto Lohn im Blick'}</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {isLoggedIn && <UserMenu />}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginLeft: "1rem" }}>
            {languages.map(lang => (
              <img
                key={lang.code}
                src={lang.flag}
                alt={lang.name}
                style={{ width: "24px", height: "24px", cursor: "pointer" }}
                onClick={() => i18next.changeLanguage(lang.code)}
                title={lang.name}
              />
            ))}
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: "2rem" }}>
        {children}
      </main>

      <footer style={{ fontSize: "0.8rem", color: "#666", textAlign: "center", margin: "1rem 0" }}>
        v0.6.0
      </footer>
    </div>
  );
}