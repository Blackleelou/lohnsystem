// src/pages/test/invite-debug.tsx

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function InviteDebugPage() {
  const { data: session } = useSession();
  const [token, setToken] = useState('');
  const [log, setLog] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    if (!token.trim()) return setLog('⚠️ Bitte Token eingeben.');

    setLog('⏳ Einladung wird geprüft ...');
    try {
      const res = await fetch('/api/team/from-invite?token=' + token.trim());
      const invitation = await res.json();

      if (!res.ok) {
        setLog('❌ Fehler: ' + invitation.error);
        return;
      }

      const invitationDetails = await fetch('/api/team/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          nickname: 'DebugTester',
          showName: false,
          showNickname: true,
          showEmail: false,
          password: '',
        }),
      });

      const joinResult = await invitationDetails.json();

      const logText = [
        '🔑 Eingeloggter User:',
        `ID: ${session?.user?.id}`,
        `Email: ${session?.user?.email}`,
        '',
        '📨 Einladung:',
        `Token: ${token}`,
        `Team: ${invitation.team?.name}`,
        '',
        '🧪 Join-Versuch:',
        JSON.stringify(joinResult, null, 2),
      ].join('\n');

      setResult(joinResult);
      setLog(logText);
    } catch (err: any) {
      setLog('❌ Fehler beim Abrufen: ' + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-sm">
      <h1 className="text-xl font-bold mb-4 text-blue-700">Einladung Debug</h1>

      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Einladungs-Token hier eingeben..."
        className="w-full px-4 py-2 border rounded mb-4"
      />

      <button
        onClick={handleCheck}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Einladung testen
      </button>

      {log && (
        <pre className="whitespace-pre-wrap mt-6 p-4 bg-gray-100 border rounded text-xs">
          {log}
        </pre>
      )}
    </div>
  );
}
