import { useState } from 'react';
import { useRouter } from 'next/router';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Registrieren</h2>

        <input type="text" name="honeypot" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" autoComplete="off" tabIndex={-1} />

        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Passwort"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              evaluateStrength(e.target.value);
            }}
            required
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <img
            src={showPassword ? "/eye-open.png" : "/eye-closed.png"}
            alt="Toggle visibility"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 w-5 h-5 cursor-pointer transform -translate-y-1/2"
          />
          <span
            onClick={() => setShowHint(!showHint)}
            title="Passwortanforderungen anzeigen"
            className="absolute top-1/2 right-10 text-sm font-bold cursor-pointer transform -translate-y-1/2"
          >
            ?
          </span>
        </div>

        <div className="h-2 w-full rounded bg-gray-300 mb-2">
          <div
            className={`h-2 rounded transition-all duration-300 ${strength <= 2 ? "bg-red-500" : strength <= 4 ? "bg-yellow-500" : "bg-green-500"}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>

        {showHint && (
          <ul className="text-xs text-gray-600 mb-4 pl-5 list-disc">
            <li>Mind. 8 Zeichen</li>
            <li>Groß- und Kleinbuchstaben</li>
            <li>Ziffern</li>
            <li>Sonderzeichen</li>
          </ul>
        )}

        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Passwort wiederholen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <img
            src={showConfirmPassword ? "/eye-open.png" : "/eye-closed.png"}
            alt="Toggle visibility"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-3 w-5 h-5 cursor-pointer transform -translate-y-1/2"
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Wird verarbeitet...' : 'Registrieren'}
        </button>

        <p className="text-center text-sm mt-4">
          <a href="/reset-request" className="text-blue-600 hover:underline">Passwort vergessen?</a>
        </p>
        <p className="text-center text-sm mt-2">
          Schon ein Konto? <a href="/login" className="text-blue-600 hover:underline">Zur Anmeldung</a>
        </p>
      </form>
    </div>
  );
}
