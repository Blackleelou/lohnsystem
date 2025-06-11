// pages/test/invitation-debug.tsx

import { useEffect, useState } from 'react';

export default function InvitationDebugPage() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/team/invitations')
      .then(res => res.json())
      .then(result => {
        if (Array.isArray(result.invitations)) {
          setData(result.invitations);
        } else {
          setError('Keine Einladungsdaten gefunden');
        }
      })
      .catch(err => {
        setError('Fehler beim Abrufen: ' + err.message);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Invitation Debug</h1>

      {error && (
        <div className="text-red-600 mb-4">
          <strong>Fehler:</strong> {error}
        </div>
      )}

      {data.length === 0 && !error && <p>Keine Einladungen gefunden.</p>}

      {data.map((inv, i) => (
        <pre
          key={inv.id || i}
          className="mb-6 p-4 bg-gray-100 border text-sm overflow-x-auto rounded"
        >
          {JSON.stringify(inv, null, 2)}
        </pre>
      ))}
    </div>
  );
}
