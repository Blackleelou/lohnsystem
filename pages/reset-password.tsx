
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { token } = router.query;

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
      setMessage('Passwort erfolgreich geändert.');
    } else {
      setError(data.message || 'Fehler beim Zurücksetzen.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f4f4f4'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: 30,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: 400
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Neues Passwort festlegen</h2>

        <div style={{ position: 'relative', marginBottom: 10 }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Neues Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 10,
              paddingRight: 40,
              boxSizing: 'border-box'
            }}
          />
          <img
            src={showPassword ? "/eye-open.png" : "/eye-closed.png"}
            alt="Toggle visibility"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              top: '50%',
              right: 10,
              width: 24,
              height: 24,
              cursor: 'pointer',
              transform: 'translateY(-50%)'
            }}
          />
        </div>

        <div style={{ position: 'relative', marginBottom: 10 }}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Passwort wiederholen"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 10,
              paddingRight: 40,
              boxSizing: 'border-box'
            }}
          />
          <img
            src={showConfirm ? "/eye-open.png" : "/eye-closed.png"}
            alt="Toggle visibility"
            onClick={() => setShowConfirm(!showConfirm)}
            style={{
              position: 'absolute',
              top: '50%',
              right: 10,
              width: 24,
              height: 24,
              cursor: 'pointer',
              transform: 'translateY(-50%)'
            }}
          />
        </div>

        {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <button type="submit" style={{
          width: '100%',
          padding: 10,
          borderRadius: 4,
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          marginTop: 10
        }}>
          Zurücksetzen
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>
          <a href="/login" style={{ marginRight: 10, color: '#0070f3', textDecoration: 'none' }}>Zur Anmeldung</a>
          |
          <a href="/register" style={{ marginLeft: 10, color: '#0070f3', textDecoration: 'none' }}>Registrieren</a>
        </p>
      </form>
    </div>
  );
}
