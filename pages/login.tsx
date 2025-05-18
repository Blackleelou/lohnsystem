
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push('/dashboard');
    } else {
      if (res?.error?.includes('E-Mail')) {
        setError('Bitte bestätige zuerst deine E-Mail-Adresse.');
      } else {
        setError('Benutzername oder Passwort ist ungültig.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f4f4' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: 30, borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Anmelden</h2>
        <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginBottom: 10, width: '100%', padding: 10 }} />
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <input type={showPassword ? "text" : "password"} placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 10, paddingRight: 40, boxSizing: 'border-box' }} />
          <img src={showPassword ? "/eye-open.png" : "/eye-closed.png"} alt="Toggle visibility" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', top: '50%', right: 10, width: 24, height: 24, cursor: 'pointer', transform: 'translateY(-50%)' }} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 4, backgroundColor: '#0070f3', color: '#fff', border: 'none' }}>Login</button>
        <p style={{ textAlign: 'center', marginTop: 12 }}>
          <a href="/reset-password" style={{ fontSize: 13, color: '#0070f3', textDecoration: 'none' }}>Passwort vergessen?</a>
        </p>
        <p style={{ textAlign: 'center', marginTop: 10 }}>
          Noch kein Konto? <a href="/register" style={{ color: '#0070f3', textDecoration: 'none' }}>Jetzt registrieren</a>
        </p>
      </form>
    </div>
  );
}
