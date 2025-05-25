import { useState } from 'react';

export default function TestEmailPage() {
  const [status, setStatus] = useState('');

  const sendTestEmail = async () => {
    setStatus('Sende Testmail...');
    try {
      const res = await fetch('/api/user/test-email', {
        method: 'POST',
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('✅ Testmail erfolgreich gesendet!');
      } else {
        setStatus(`❌ Fehler: ${data.message}`);
      }
    } catch (err) {
      setStatus('❌ Netzwerkfehler oder Serverfehler.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Test-E-Mail auslösen</h1>
      <button onClick={sendTestEmail}>Testmail senden</button>
      <p>{status}</p>
    </div>
  );
}
