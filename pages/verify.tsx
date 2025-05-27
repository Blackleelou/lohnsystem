import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function VerifyPage() {
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const email = (router.query.email as string) || "";

  // Automatische Überprüfung, wenn alle Felder ausgefüllt sind
  const checkAndSubmit = async (vals: string[]) => {
    if (vals.every(v => v !== "")) {
      setLoading(true);
      setError("");
      setSuccess("");
      const code = vals.join("");
      try {
        const res = await fetch("/api/user/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Fehler bei der Verifizierung.");
        } else {
          setSuccess("Verifizierung erfolgreich! Du wirst weitergeleitet ...");
          // Automatischer Login (nach erfolgreicher Verifizierung)
          setTimeout(async () => {
            // Optional: Passwort aus sessionStorage holen (wie bei Registrierung)
            const password = sessionStorage.getItem("initialPassword") || "";
            // Automatisch anmelden
            const loginResult = await signIn("credentials", {
              email,
              password,
              redirect: false,
              callbackUrl: "/dashboard",
            });
            // Wenn Login klappt, weiterleiten, sonst zur Login-Seite
            if (loginResult?.ok) {
              router.push("/dashboard");
            } else {
              router.push("/login");
            }
          }, 1300);
        }
      } catch {
        setError("Serverfehler. Bitte versuche es erneut.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Beim Einfügen (Paste) alle Felder befüllen
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, idx: number) => {
    const pasted = e.clipboardData.getData("Text").replace(/\D/g, "");
    if (pasted.length === 6) {
      const arr = pasted.split("");
      setValues(arr);
      // Sofort prüfen:
      checkAndSubmit(arr);
      e.preventDefault();
    }
  };

  // Bei Eingabe einzelne Felder ausfüllen
  const handleChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return; // Nur Ziffern
    const newVals = [...values];
    newVals[idx] = val;
    setValues(newVals);

    if (val && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
    if (!val && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }

    // Sofort prüfen, wenn alle Felder befüllt sind
    setTimeout(() => checkAndSubmit(newVals), 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={e => e.preventDefault()}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl px-8 py-8 w-full max-w-md flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-center mb-3 text-blue-700 dark:text-blue-300">
          E-Mail bestätigen
        </h2>
        <p className="mb-5 text-center text-gray-500 dark:text-gray-300 text-sm">
          Wir haben dir einen 6-stelligen Bestätigungscode geschickt.<br />
          Bitte gib ihn unten ein, um dein Konto zu aktivieren.
        </p>
        <div className="flex gap-2 mb-6">
          {values.map((val, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`w-12 h-12 rounded-lg text-2xl font-bold text-center border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 transition bg-gray-50 dark:bg-gray-700 outline-none ${val ? "border-blue-500" : ""}`}
              value={val}
              onChange={e => handleChange(i, e.target.value)}
              onPaste={e => handlePaste(e, i)}
              onKeyDown={e => {
                if (e.key === "Backspace" && !values[i] && i > 0) {
                  handleChange(i - 1, "");
                }
              }}
              autoFocus={i === 0}
              disabled={loading}
              aria-label={`Stelle ${i + 1} des Codes`}
            />
          ))}
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white font-semibold transition flex items-center justify-center ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          disabled={loading || values.some(v => v === "")}
          style={{ display: "none" }} // Der Button ist für Accessibility, aber nicht sichtbar
        >
          {loading ? (
            <span className="inline-block w-6 h-6 border-2 border-white border-t-blue-400 rounded-full animate-spin"></span>
          ) : (
            "Bestätigen"
          )}
        </button>

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mt-4 text-center">{success}</p>}

        <p className="text-xs text-gray-400 mt-6">
          Du hast keinen Code erhalten?{" "}
          <a href={`/reset-request?email=${encodeURIComponent(email)}`} className="text-blue-600 hover:underline">
            Erneut senden
          </a>
        </p>
      </form>
    </div>
  );
}
