import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieAccepted");
    if (!accepted) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#333",
      color: "#fff",
      padding: "1rem",
      textAlign: "center",
      zIndex: 9999
    }}>
      <p style={{ margin: "0 0 0.5rem 0" }}>
        Wir verwenden Cookies, um die Nutzererfahrung zu verbessern.
      </p>
      <button onClick={acceptCookies} style={{
        backgroundColor: "#fff",
        color: "#000",
        border: "none",
        padding: "0.5rem 1rem",
        cursor: "pointer"
      }}>
        Verstanden
      </button>
    </div>
  );
}