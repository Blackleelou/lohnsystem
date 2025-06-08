import { useState } from 'react';
import { Mail, Loader2, LogIn } from 'lucide-react';

export default function ResetRequestPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const res = await fetch('/api/user/reset-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Falls die E-Mail existiert, wurde ein Link gesendet.');
    } else {
      setError(data.message || 'Fehler beim Senden.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950">
      <form
        onSubmit={handleRequest}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-sm p-8 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-2 flex justify-center items-center gap-2">
          <LogIn className="w-7 h-7 text-blue-400" />
          Passwort zurücksetzen
        </h2>
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
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-bold shadow-md"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
          {loading ? 'Sende...' : 'Link anfordern'}
        </button>
        {message && <p className="text-green-600 text-center mt-2 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-center mt-2 text-sm">{error}</p>}
        <p className="text-center mt-3 text-xs">
          <a href="/login" className="text-blue-600 hover:underline">
            Zur Anmeldung
          </a>
        </p>
      </form>
    </div>
  );
}
