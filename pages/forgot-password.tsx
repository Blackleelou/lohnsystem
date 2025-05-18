import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const res = await fetch('/api/user/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('E-Mail mit Link wurde gesendet.');
    } else {
      setError(data.message || 'Fehler beim Senden.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 30, borderRadius: 8, width: '100%', maxWidth: 400 }}>
        <h2>Passwort vergessen</h2>
        <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 10, marginBottom: 10 }} />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Link senden</button>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}