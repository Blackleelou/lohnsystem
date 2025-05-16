
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Registrierungslösung folgt später
    alert("Registrierung wurde abgesendet!");
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f4f4f4',
      margin: 0,
      padding: 0,
    }}>
      <form onSubmit={handleRegister} style={{
        background: 'white',
        padding: 30,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: 400,
        boxSizing: 'border-box'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Registrieren</h2>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: 10, width: '100%', padding: 10 }}
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: 10, width: '100%', padding: 10 }}
        />
        <input
          type="password"
          placeholder="Passwort wiederholen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ marginBottom: 10, width: '100%', padding: 10 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Registrieren</button>
        <p style={{ textAlign: 'center', marginTop: 20 }}>
          Schon ein Konto? <a href="/login" style={{ color: '#0070f3', textDecoration: 'none' }}>Zur Anmeldung</a>
        </p>
      </form>
    </div>
  );
}
