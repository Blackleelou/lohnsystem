import { useState } from 'react';

export default function RegisterPage() {
  const [password, setPassword] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const passwordStrength = (value: string) => {
    let strength = 0;
    if (/[a-z]/.test(value)) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;
    return strength;
  };

  return (
    <div style={{ padding: 20 }}>
      <label style={{ display: 'block', marginBottom: 8 }}>
        Passwort{' '}
        <span
          style={{ cursor: 'pointer', color: '#0070f3' }}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          [?]
        </span>
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: 10 }}
      />
      {showTooltip && (
        <div style={{
          background: '#f0f0f0',
          padding: 10,
          borderRadius: 4,
          marginTop: 10,
          fontSize: 14,
        }}>
          <strong>Passwortanforderungen:</strong>
          <ul style={{ marginTop: 6, paddingLeft: 20 }}>
            <li>Mind. 1 Kleinbuchstabe</li>
            <li>Mind. 1 Großbuchstabe</li>
            <li>Mind. 1 Zahl</li>
            <li>Mind. 1 Sonderzeichen</li>
          </ul>
        </div>
      )}
      <div style={{
        height: 6,
        marginTop: 10,
        background: '#eee',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${(passwordStrength(password) / 4) * 100}%`,
          height: '100%',
          background: passwordStrength(password) < 2 ? 'red' :
                      passwordStrength(password) < 4 ? 'orange' : 'green',
          transition: 'width 0.3s ease'
        }}></div>
      </div>
    </div>
  );
}