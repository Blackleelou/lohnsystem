
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
  const router = useRouter();

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
        // Passwort in sessionStorage speichern
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f4f4' }}>
      <form onSubmit={handleRegister} style={{ background: 'white', padding: 30, borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Registrieren</h2>
        <input type="text" name="honeypot" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: 'none' }} autoComplete="off" tabIndex={-1} />
        <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginBottom: 10, width: '100%', padding: 10 }} />
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <input type={showPassword ? "text" : "password"} placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 10, paddingRight: 40, boxSizing: 'border-box' }} />
          <img src={showPassword ? "/eye-open.png" : "/eye-closed.png"} alt="Toggle visibility" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', top: '50%', right: 10, width: 24, height: 24, cursor: 'pointer', transform: 'translateY(-50%)' }} />
        </div>
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <input type={showConfirmPassword ? "text" : "password"} placeholder="Passwort wiederholen" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: 10, paddingRight: 40, boxSizing: 'border-box' }} />
          <img src={showConfirmPassword ? "/eye-open.png" : "/eye-closed.png"} alt="Toggle visibility" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', top: '50%', right: 10, width: 24, height: 24, cursor: 'pointer', transform: 'translateY(-50%)' }} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, borderRadius: 4, backgroundColor: '#0070f3', color: '#fff', border: 'none' }}>
          {loading ? 'Wird verarbeitet...' : 'Registrieren'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 12 }}>
          <a href="/reset-password" style={{ fontSize: 13, color: '#0070f3', textDecoration: 'none' }}>Passwort vergessen?</a>
        </p>
        <p style={{ textAlign: 'center', marginTop: 10 }}>
          Schon ein Konto? <a href="/login" style={{ color: '#0070f3', textDecoration: 'none' }}>Zur Anmeldung</a>
        </p>
      </form>
    </div>
  );
}
