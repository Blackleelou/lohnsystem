import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [honeypot, setHoneypot] = useState("");
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
        body: JSON.stringify({ email, code, honeypot }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok) {
            toast.success("Verifiziert – du wirst eingeloggt...", {
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false
            });

            const storedPass = sessionStorage.getItem("initialPassword");
            if (!storedPass) {
              return router.push("/login");
            }

            setTimeout(async () => {
              const loginRes = await signIn("credentials", {
                email,
                password: storedPass,
                redirect: false,
              });

              if (loginRes?.ok) {
                sessionStorage.removeItem("initialPassword");
                router.push("/dashboard");
              } else {
                router.push("/login");
              }
            }, 2500);
          } else {
            setError(data.message || "Code ungültig.");
            setCode("");
          }
        })
        .catch(() => {
          setError("Netzwerkfehler. Bitte erneut versuchen.");
        });
    }
  }, [code, email, honeypot, router]);

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">E-Mail bestätigen</h2>
        <p className="text-sm text-center mb-6 text-gray-700">
          Wir haben dir eine E-Mail mit einem 6-stelligen Code geschickt. Gib den Code hier ein, um dein Konto zu aktivieren.
        </p>

        <input
          type="text"
          placeholder="6-stelliger Code"
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
          }
          inputMode="numeric"
          required
          autoFocus
          className="w-full p-3 text-center text-lg tracking-widest mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          className="hidden"
        />

        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        {info && <p className="text-green-600 text-center mt-2">{info}</p>}

        <div className="text-center text-sm mt-5">
          Keine E-Mail erhalten? <br />
          <button
            type="button"
            onClick={resendCode}
            disabled={cooldown > 0}
            className="text-blue-600 hover:underline mt-1 disabled:text-gray-400"
          >
            Code erneut senden {cooldown > 0 ? `(${cooldown}s)` : ""}
          </button>
        </div>
      </form>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
