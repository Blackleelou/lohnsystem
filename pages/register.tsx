
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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
          style={{ width: '100%', padding: 10,  marginBottom: 10, borderRadius: 4, border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
        <div style={{ position: 'relative', width: '100%', marginBottom: 10 }}>
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
        <div style={{ position: 'relative', width: '100%', marginBottom: 10 }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Passwort wiederholen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            src={showConfirmPassword ? "/eye-open.png" : "/eye-closed.png"}
            alt="Toggle visibility"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button type="submit" style={{
            flex: 1,
            padding: 10, borderRadius: 4,
            backgroundColor: '#0070f3', borderRadius: 4,
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}>
            Registrieren
          </button>
          <button type="button" onClick={() => window.location.href = '/login'} style={{
            flex: 1,
            padding: 10, borderRadius: 4,
            backgroundColor: '#e0e0e0', borderRadius: 4,
            color: '#000',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}>
            Zur Anmeldung
          </button>
        </div>
      </form>
    </div>
  );
}
