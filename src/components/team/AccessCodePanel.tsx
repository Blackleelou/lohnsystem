
import { useEffect, useState } from 'react';
import { Copy, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import * as Tooltip from "@radix-ui/react-tooltip";

type Invitation = {
  id: string;
  token: string;
  type: string;
  role: string;
  createdBy: string;
  expiresAt: string;
  createdByUser?: {
    name?: string;
    nickname?: string;
    email?: string;
  };
};

export default function AccessCodePanel() {
  const [password, setPassword] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [debugError, setDebugError] = useState<string | null>(null); // Fehleranzeige

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

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/team/invitations');
      const data = await res.json();
      if (res.ok && Array.isArray(data.invitations)) {
        setInvitations(data.invitations);
        setDebugError(null); // Fehleranzeige zurücksetzen
      } else {
        setDebugError(`Fehler vom Server: ${data?.error || 'Unbekannter Fehler'}`);
      }
    } catch (err: any) {
      console.error('Fehler beim Laden der Einladungen', err);
      setDebugError(`Fehler: ${err?.message || err.toString()}`);
    }
  };

  const deleteInvitation = async (token: string) => {
    if (!confirm('Einladung wirklich löschen?')) return;

    try {
      const res = await fetch('/api/team/delete-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        toast.success('Einladung gelöscht');
        fetchInvitations();
      } else {
        toast.error('Löschen fehlgeschlagen');
      }
    } catch (err) {
      toast.error('Serverfehler beim Löschen');
    }
  };

  useEffect(() => {
    fetchPassword();
    fetchInvitations();
  }, []);

  return (
    <div className="space-y-12 max-w-4xl mx-auto p-4 bg-white border rounded shadow">
      <div>
        <h2 className="text-xl font-bold mb-4">QR-Passwort (geschützte Einladung)</h2>
        {loading ? (
          <p>Lade…</p>
        ) : (
          <>
            <p className="text-gray-700 mb-2">Aktuelles Passwort:</p>
            <p className="text-2xl font-mono mb-4">{password || '–'}</p>
            {validUntil && (
              <div className="text-sm text-gray-500 flex flex-wrap gap-4 mb-4">
                <span>
                  Gültig bis:{' '}
                  <strong>
                    {new Date(validUntil).toLocaleString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </strong>
                </span>
                <span className="text-gray-400 text-sm">
                  Noch gültig für:{' '}
                  <strong>
                    {(() => {
                      const diff = new Date(validUntil).getTime() - new Date().getTime();
                      if (diff <= 0) return 'abgelaufen';
                      const hours = Math.floor(diff / (1000 * 60 * 60));
                      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                      return `${hours}h ${minutes}min`;
                    })()}
                  </strong>
                </span>
              </div>
            )}
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

      <div>
        <h2 className="text-xl font-bold mb-4">Aktive Einladungen</h2>
        <p className="text-sm text-gray-500 mb-2">Einladungen verfallen automatisch 90 Tage nach Erstellung.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2">Typ</th>
                <th className="px-3 py-2">Rolle</th>
                <th className="px-3 py-2">Erstellt von</th>
                <th className="px-3 py-2">Gültig bis</th>
                <th className="px-3 py-2">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((inv) => (
                <tr key={inv.id} className="border-t">
                  <td className="px-3 py-2">{inv.type}</td>
                  <td className="px-3 py-2">{inv.role}</td>
                  <td className="px-3 py-2">{inv.createdByUser?.name || inv.createdByUser?.nickname || inv.createdBy || '–'}</td>
                  <td className="px-3 py-2">{new Date(inv.expiresAt).toLocaleDateString('de-DE')}</td>
                  <td className="px-3 py-2">
  <div className="flex items-center gap-3">

    {/* ✅ 1. Nur Kopieren testen – mit try/catch */}
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/join/${inv.token}`);
          toast.success('Link wurde kopiert!');
        } catch (err) {
          console.error('Fehler beim Kopieren:', err);
          toast.error('Kopieren fehlgeschlagen');
        }
      }}
      title="Link kopieren"
      className="text-blue-600 hover:text-blue-800 transition"
    >
      <Copy size={18} />
    </button>

    {/* ✅ 2. Bearbeiten-Link OHNE Tooltip testen */}
    {(inv.type === 'qr_simple' || inv.type === 'qr_protected') && (
      <a
        href={`/team/print/${inv.token}?edit=1`}
        className="text-gray-600 hover:text-black transition"
      >
        ✏️
      </a>
    )}

    {/* ✅ 3. Löschen */}
    <button
      onClick={() => deleteInvitation(inv.token)}
      title="Einladung löschen"
      className="text-red-600 hover:text-red-800 transition"
    >
      <Trash2 size={18} />
    </button>
  </div>
</td>
                </tr>
              ))}
              {invitations.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">Keine aktiven Einladungen vorhanden.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {debugError && (
          <div className="mt-6 text-red-600 text-sm whitespace-pre-wrap bg-red-50 border border-red-200 p-3 rounded">
            <strong>Fehler-Log:</strong><br />
            {debugError}
          </div>
        )}
      </div>
    </div>
  );
}
