// pages/test/qr-cleanup.tsx

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type Invitation = {
  id: string;
  token: string;
  type: string;
  password: string | null;
  createdAt: string;
  expiresAt: string;
};

export default function QRCleanupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') return;

    fetch('/api/team/invitations')
      .then(res => res.json())
      .then(data => {
        const broken = data.invitations.filter(
          (inv: Invitation) =>
            inv.type === 'qr_protected' &&
            (inv.password === null || inv.password.trim() === '')
        );
        setInvitations(broken);
        setLoading(false);
      });
  }, [status]);

  const deleteInvite = async (id: string) => {
    if (!confirm('Einladung wirklich löschen?')) return;

    const res = await fetch('/api/team/delete-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setInvitations(prev => prev.filter(inv => inv.id !== id));
    } else {
      alert('Fehler beim Löschen.');
    }
  };

  if (status === 'loading' || loading) return <div className="p-6">Lade...</div>;

  if (!session) return <div className="p-6">Nicht eingeloggt.</div>;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-xl font-bold mb-4">Fehlerhafte QR-Einladungen (qr_protected ohne Passwort)</h1>

      {invitations.length === 0 ? (
        <p className="text-gray-600">Keine fehlerhaften Einladungen gefunden.</p>
      ) : (
        <ul className="space-y-4">
          {invitations.map(inv => (
            <li key={inv.id} className="border border-gray-300 p-4 rounded">
              <p className="text-sm mb-2">Token: <code>{inv.token}</code></p>
              <p className="text-sm">Erstellt: {new Date(inv.createdAt).toLocaleString()}</p>
              <p className="text-sm">Ablauf: {new Date(inv.expiresAt).toLocaleString()}</p>
              <button
                onClick={() => deleteInvite(inv.id)}
                className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Löschen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
