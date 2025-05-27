import { useState } from 'react';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Mail, Lock, UserPlus, Loader2, ChevronRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [strength, setStrength] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const router = useRouter();

  const evaluateStrength = (val: string) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[a-z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setStrength(score);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (honeypot.trim() !== '') {
      setError('Ungültige Eingabe.');
      setLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Fehler bei der Registrierung.');
      } else {
        sessionStorage.setItem("initialPassword", password);
        await fetch('/api/user/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      setError('Serverfehler. Bitte später erneut versuchen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950">
      <form
        onSubmit={handleRegister}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-sm p-8 flex flex-col gap-6"
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-2 flex justify-center items-center gap-2">
          <UserPlus className="w-7 h-7 text-blue-400" />
          Registrieren
        </h2>

        <input type="text" name="honeypot" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" autoComplete="off" tabIndex={-1} />

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="email">
            E-Mail
          </label>
          <div className="flex items-center rounded-lg bg-blue-50 dark:bg-gray-800 px-3 py-2">
            <Mail className="w-4 h-4 mr-2 text-blue-400 dark:text-gray-500" />
            <input
              id="email"
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Passwortfeld */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="password">
            Passwort
          </label>
          <div className="flex items-center rounded-lg bg-blue-50 dark:bg-gray-800 px-3 py-2 relative">
            <Lock className="w-4 h-4 mr-2 text-blue-400 dark:text-gray-500" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Passwort"
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

        {/* Passwort-Stärke-Anzeige */}
        <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-800 mb-2">
          <div
            className={`h-2 rounded transition-all duration-300 ${strength <= 2 ? "bg-red-500" : strength <= 4 ? "bg-yellow-500" : "bg-green-500"}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>

        {showHint && (
          <ul className="text-xs text-gray-600 dark:text-gray-300 mb-2 pl-5 list-disc">
            <li>Mind. 8 Zeichen</li>
            <li>Groß- und Kleinbuchstaben</li>
            <li>Ziffern</li>
            <li>Sonderzeichen</li>
          </ul>
        )}

        {/* Passwort bestätigen */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="confirm-password">
            Passwort wiederholen
          </label>
          <div className="flex items-center rounded-lg bg-blue-50 dark:bg-gray-800 px-3 py-2">
            <Lock className="w-4 h-4 mr-2 text-blue-400 dark:text-gray-500" />
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Passwort wiederholen"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              className="ml-2 text-blue-400 dark:text-gray-400 focus:outline-none"
              title={showConfirmPassword ? "Passwort verbergen" : "Passwort anzeigen"}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-bold shadow-md mt-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
          {loading ? 'Wird verarbeitet...' : 'Registrieren'}
        </button>

        <div className="flex flex-col gap-1 text-xs mt-3 text-center">
          <a href="/reset-request" className="text-blue-600 hover:underline">Passwort vergessen?</a>
          <span className="text-gray-400">Schon ein Konto?</span>
          <a href="/login" className="inline-flex items-center text-blue-600 hover:underline font-semibold justify-center gap-1">
            <ChevronRight className="w-3 h-3" /> Zur Anmeldung
          </a>
        </div>
      </form>
    </div>
  );
}
