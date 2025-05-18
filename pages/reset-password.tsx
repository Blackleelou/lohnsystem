import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || typeof token !== 'string') return;
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
      setMessage('Passwort erfolgreich geändert. Du kannst dich nun anmelden.');
    } else {
      setError(data.message || 'Fehler beim Zurücksetzen.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f4f4' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 30, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Neues Passwort</h2>
        <input
          type="password"
          placeholder="Neues Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Passwort wiederholen"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Zurücksetzen</button>
        {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      </form>
    </div>
  );
}