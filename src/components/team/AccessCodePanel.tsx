import { useEffect, useState } from 'react';

export default function AccessCodePanel() {
  const [password, setPassword] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Passwort vom Server abrufen
  const fetchPassword = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/team/get-access-password');
      const data = await res.json();
      if (res.ok && data.password) {
        setPassword(data.password);
        setValidUntil(data.validUntil);
      }
    } catch (err) {
      console.error('Fehler beim Abrufen des Passworts', err);
    } finally {
      setLoading(false);
    }
  };

  // Passwort manuell neu generieren
  const regeneratePassword = async () => {
    setRegenerating(true);
    try {
      const res = await fetch('/api/team/rotate-access-password', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.password) {
        setPassword(data.password);
        setValidUntil(data.validUntil);
      }
    } catch (err) {
      console.error('Fehler beim Generieren', err);
    } finally {
      setRegenerating(false);
    }
  };

  useEffect(() => {
    fetchPassword();
  }, []);

  return (
    <div className="p-4 border rounded shadow max-w-xl mx-auto bg-white">
      <h2 className="text-xl font-bold mb-4">QR-Passwort (geschützte Einladung)</h2>

      {loading ? (
        <p>Lade…</p>
      ) : (
        <>
          <p className="text-gray-700 mb-2">Aktuelles Passwort:</p>
          <p className="text-2xl font-mono mb-4">{password || '–'}</p>

          <p className="text-sm text-gray-500 mb-4">
            Gültig bis: <strong>{validUntil || '–'}</strong>
          </p>

          <button
            onClick={regeneratePassword}
            disabled={regenerating}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {regenerating ? 'Erzeuge neues Passwort…' : 'Jetzt manuell erneuern'}
          </button>
        </>
      )}
    </div>
  );
}
