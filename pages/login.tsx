
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Bitte eine gültige E-Mail-Adresse eingeben.');
      return;
    }
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setError('Benutzername oder Passwort ist ungültig.');
    }
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
      <form onSubmit={handleLogin} style={{
        background: 'white',
        padding: 30,
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: 400,
        boxSizing: 'border-box'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Anmelden</h2>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: 10, width: '100%', padding: '10px 40px 10px 10px' }}
        />
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 40px 10px 10px' }}
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
        <button type="submit" style={{ width: '100%', padding: '10px 40px 10px 10px' }}>Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p style={{ textAlign: 'center', marginTop: 20 }}>
          Noch kein Konto? <a href="/register" style={{ color: '#0070f3', textDecoration: 'none' }}>Jetzt registrieren</a>
        </p>
      </form>
    </div>
  );
}
