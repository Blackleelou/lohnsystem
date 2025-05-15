"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";").map(c => c.trim());
      const userCookie = cookies.find(c => c.startsWith("userId="));
      setShowMenu(!!userCookie);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "userId=; Max-Age=0; Path=/; SameSite=Lax; Secure";
    router.push("/login");
  };

  if (!showMenu) return null;

  return (
    <div
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
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
