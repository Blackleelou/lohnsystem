import { useState } from 'react';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRequest} className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Passwort zurücksetzen</h2>

        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 pr-10 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Sende..." : "Link anfordern"}
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
