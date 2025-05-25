import { useState } from 'react';
import { useRouter } from 'next/router';

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
  const { token } = router.query;

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
      setMessage('Passwort erfolgreich geändert. Weiterleitung...');
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setError(data.message || 'Fehler beim Zurücksetzen.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Neues Passwort festlegen
        </h2>

        {/* Passwort */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Neues Passwort"
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
            alt="Toggle password"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
          />
          <span
            onClick={() => setShowHint(!showHint)}
            title="Passwortanforderungen anzeigen"
            className="absolute top-1/2 right-10 transform -translate-y-1/2 font-bold cursor-pointer text-blue-500"
          >
            ?
          </span>
        </div>

        {/* Fortschrittsbalken */}
        <div className="h-2 bg-gray-200 rounded mb-2">
          <div
            className={`h-full rounded transition-all duration-300 ${
              strength <= 2
                ? 'bg-red-500 w-1/4'
                : strength <= 4
                ? 'bg-yellow-500 w-3/4'
                : 'bg-green-500 w-full'
            }`}
          />
        </div>

        {/* Passwort-Hinweise */}
        {showHint && (
          <ul className="text-sm text-gray-600 mb-4 list-disc list-inside">
            <li>Mindestens 8 Zeichen</li>
            <li>Groß- und Kleinbuchstaben</li>
            <li>Ziffern</li>
            <li>Sonderzeichen</li>
          </ul>
        )}

        {/* Passwort wiederholen */}
        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Passwort wiederholen"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <img
            src={showConfirm ? "/eye-open.png" : "/eye-closed.png"}
            alt="Toggle confirm password"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Zurücksetzen
        </button>

        {message && <p className="text-green-600 text-center mt-4 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-center mt-4 text-sm">{error}</p>}

        <p className="text-center mt-6 text-sm">
          <a href="/login" className="text-blue-600 hover:underline">Zur Anmeldung</a>
        </p>
      </form>
    </div>
  );
}
