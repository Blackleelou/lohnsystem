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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f4f4' }}>
      <form onSubmit={handleRequest} style={{ background: 'white', padding: 30, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Passwort zurücksetzen</h2>
        <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginBottom: 10, width: '100%', padding: 10 }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, borderRadius: 4, backgroundColor: '#0070f3', color: '#fff', border: 'none' }}>
          {loading ? "Sende..." : "Link anfordern"}
        </button>
        {message && <p style={{ color: 'green', textAlign: 'center', marginTop: 15 }}>{message}</p>}
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: 15 }}>{error}</p>}
      </form>
    </div>
  );
}
