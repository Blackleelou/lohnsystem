import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Benutzername oder Passwort ist ungültig.');
    } else {
      window.location.href = '/dashboard';
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
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Login</h2>

        {error && (
          <div style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box' }}
        />

        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 40px 10px 10px',
              borderRadius: 4,
              border: '1px solid #ccc',
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

        <button type="submit" style={{
          width: '100%',
          marginTop: 20,
          padding: 10,
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          boxSizing: 'border-box'
        }}>
          Anmelden
        </button>
      </form>
    </div>
  );
}

LoginPage.getLayout = (page: React.ReactNode) => page;
