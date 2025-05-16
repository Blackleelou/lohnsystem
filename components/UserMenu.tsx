import { useState } from "react";
import { signOut } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "none",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        &#9776;
      </button>
      {isOpen && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "40px",
          background: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          padding: "1rem",
          zIndex: 1000,
          borderRadius: "8px",
        }}>
          <div style={{ color: "red", cursor: "pointer", marginBottom: "0.5rem" }} onClick={() => signOut()}>
            Logout
          </div>
          <LanguageSwitcher />
        </div>
      )}
    </div>
  );
}