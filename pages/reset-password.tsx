import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Lock, Loader2, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { token, email } = router.query;

  const evaluateStrength = (val: string) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[a-z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setStrength(score);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirm) {
      setError('Passwörter stimmen nicht überein.');
      return;
    }

    const res = await fetch('/api/user/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Passwort erfolgreich geändert. Du wirst jetzt eingeloggt...');
      // Automatisch einloggen!
      const userEmail = (typeof email === "string" && email) ? email : (data.email || "");
      if (userEmail) {
        await signIn("credentials", {
          email: userEmail,
          password,
          callbackUrl: "/dashboard",
        });
      } else {
        setTimeout(() => router.push('/login'), 2000);
      }
      return;
    } else {
      setError(data.message || 'Fehler beim Zurücksetzen.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-sm p-8 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-2 flex justify-center items-center gap-2">
          <Lock className="w-7 h-7 text-blue-400" />
          Neues Passwort festlegen
        </h2>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="password">
            Neues Passwort
          </label>
          <div className="flex items-center rounded-lg bg-blue-50 dark:bg-gray-800 px-3 py-2 relative">
            <Lock className="w-4 h-4 mr-2 text-blue-400 dark:text-gray-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Neues Passwort"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                evaluateStrength(e.target.value);
              }}
              required
              autoComplete="new-password"
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="ml-2 text-blue-400 dark:text-gray-400 focus:outline-none"
              title={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              className="ml-1 text-blue-400 dark:text-blue-300 focus:outline-none"
              title="Passwortanforderungen anzeigen"
              onClick={() => setShowHint(!showHint)}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Fortschrittsbalken */}
        <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-800 mb-2">
          <div
            className={`h-2 rounded transition-all duration-300 ${strength <= 2 ? "bg-red-500" : strength <= 4 ? "bg-yellow-500" : "bg-green-500"}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        {showHint && (
          <ul className="text-xs text-gray-600 dark:text-gray-300 mb-2 pl-5 list-disc">
            <li>Mindestens 8 Zeichen</li>
            <li>Groß- und Kleinbuchstaben</li>
            <li>Ziffern</li>
            <li>Sonderzeichen</li>
          </ul>
        )}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="confirm">
            Passwort wiederholen
          </label>
          <div className="flex items-center rounded-lg bg-blue-50 dark:bg-gray-800 px-3 py-2">
            <Lock className="w-4 h-4 mr-2 text-blue-400 dark:text-gray-500" />
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Passwort wiederholen"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
              className="ml-2 text-blue-400 dark:text-gray-400 focus:outline-none"
              title={showConfirm ? "Passwort verbergen" : "Passwort anzeigen"}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-bold shadow-md mt-2"
        >
          <Loader2 className={`w-5 h-5 ${message ? "animate-spin" : ""}`} />
          Zurücksetzen
        </button>
        {message && <p className="text-green-600 text-center mt-2 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-center mt-2 text-sm">{error}</p>}
        <p className="text-center mt-3 text-xs">
          <a href="/login" className="text-blue-600 hover:underline">Zur Anmeldung</a>
        </p>
      </form>
    </div>
  );
}
