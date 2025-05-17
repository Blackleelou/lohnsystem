
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromQuery = params.get("email");
    if (emailFromQuery) setEmail(emailFromQuery);
  }, []);

  useEffect(() => {
    if (code.length === 6) {
      fetch("/api/user/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok) {
            router.push("/dashboard");
          } else {
            setError(data.message || "Code ungültig.");
            setCode("");
          }
        })
        .catch(() => {
          setError("Netzwerkfehler. Bitte erneut versuchen.");
        });
    }
  }, [code, email, router]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const resendCode = async () => {
    if (!email || cooldown > 0) return;
    try {
      const res = await fetch("/api/user/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setInfo("Code wurde erneut gesendet.");
        setCooldown(60);
      } else {
        setError(data.message || "Fehler beim Senden des Codes.");
      }
    } catch {
      setError("Fehler beim Verbindungsaufbau.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f4f4f4" }}>
      <form style={{ background: "white", padding: 30, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", width: "100%", maxWidth: 400 }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>E-Mail bestätigen</h2>
        <p style={{ textAlign: "center", marginBottom: 20, fontSize: 14 }}>
          Wir haben dir eine E-Mail mit einem 6-stelligen Code geschickt.<br />
          Gib den Code hier ein, um dein Konto zu aktivieren.
        </p>
        <input
          type="text"
          placeholder="6-stelliger Code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
          required
          inputMode="numeric"
          autoFocus
          style={{ marginBottom: 10, width: "100%", padding: 10, fontSize: 18, textAlign: "center", letterSpacing: 6 }}
        />
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {info && <p style={{ color: "green", textAlign: "center" }}>{info}</p>}
        <p style={{ textAlign: "center", fontSize: 13, marginTop: 20 }}>
          Keine E-Mail erhalten? <br />
          <button type="button" onClick={resendCode} disabled={cooldown > 0} style={{ background: "none", border: "none", color: "#0070f3", cursor: "pointer" }}>
            Code erneut senden {cooldown > 0 ? `(${cooldown}s)` : ""}
          </button>
        </p>
      </form>
    </div>
  );
}
