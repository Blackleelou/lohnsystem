"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookieSet = document.cookie.includes("userId=");
    setIsLoggedIn(cookieSet);
  }, []);

  const handleLogout = () => {
    document.cookie = "userId=; Max-Age=0; Path=/; SameSite=Lax; Secure";
    router.push("/login");
  };

  if (!isLoggedIn) return null;

  return (
    <div
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
      onClick={() => setDropdownOpen(prev => !prev)}
      style={{ position: "relative", marginRight: "1rem" }}
    >
      <div
        style={{
          border: "2px solid black",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        J
      </div>
      {dropdownOpen && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem",
            minWidth: "180px",
            zIndex: 10,
          }}
        >
          <div style={{ padding: "0.5rem", cursor: "pointer" }}>Persönliche Daten</div>
          <div style={{ padding: "0.5rem", cursor: "pointer" }}>Einstellungen</div>
          <div
            onClick={handleLogout}
            style={{ padding: "0.5rem", cursor: "pointer", color: "red" }}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
}