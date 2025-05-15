import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const [passVisible, setPassVisible] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = document.cookie.includes("userId=");
    setLoggedIn(isLoggedIn);
    if (isLoggedIn) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      window.location.href = "/dashboard";
    } else {
      const msg = await res.text();
      setError(msg || "Login fehlgeschlagen");
    }
  };

  if (loggedIn) return null;

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", background: "#fff", padding: "2rem", borderRadius: "8px", boxShadow: "0 0 8px rgba(0,0,0,0.1)", marginTop: "2rem" }}>
      <form onSubmit={handleLogin}>
        <h2>{t('login.title') || 'Login'}</h2>
        <input name="email" type="text" placeholder={t('login.username') || 'E-Mail'} required style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }} />
        <div style={{ position: "relative" }}>
          <input name="password" type={passVisible ? "text" : "password"} placeholder={t('login.password') || 'Passwort'} required style={{ width: "100%", padding: "0.5rem" }} />
          <span onClick={() => setPassVisible(!passVisible)} style={{ position: "absolute", right: "0.5rem", top: "30%", cursor: "pointer" }}>👁️</span>
        </div>
        <button type="submit" style={{ width: "100%", padding: "0.5rem", marginTop: "1rem" }}>{t('login.submit') || 'Anmelden'}</button>
        {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
      </form>
    </div>
  );
}
