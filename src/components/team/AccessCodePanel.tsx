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
      }
    } catch (err) {
      console.error('Fehler beim Laden der Einladungen', err);
    }
  };

  const deleteInvitation = async (id: string) => {
    if (!confirm('Einladung wirklich löschen?')) return;
    await fetch(`/api/team/delete-invite?id=${id}`, { method: 'DELETE' });
    fetchInvitations();
  };

  useEffect(() => {
    fetchPassword();
    fetchInvitations();
  }, []);

  return (
    <div className="space-y-12 max-w-4xl mx-auto p-4 bg-white border rounded shadow">
      {/* Passwortbereich */}
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

      {/* Einladungstabelle */}
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
                  <td className="px-3 py-2">
                    {inv.type === 'qr_simple' && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        QR (einfach)
                      </span>
                    )}
                    {inv.type === 'qr_protected' && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        QR (mit Passwort)
                      </span>
                    )}
                    {inv.type === 'single_use' && (
                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        Einmal-Link
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">{inv.role}</td>
                  <td className="px-3 py-2">
                    {inv.createdByUser?.name || inv.createdByUser?.nickname || inv.createdBy || '–'}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(inv.expiresAt).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      {/* Link kopieren */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/join/${inv.token}`);
                          toast.success('Link wurde kopiert!');
                        }}
                        title="Link kopieren"
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <Copy size={18} />
                      </button>

                      {/* Bearbeiten */}
                      {(inv.type === 'qr_simple' || inv.type === 'qr_protected') && (
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <a
                              href={`/team/print/${inv.token}?edit=1`}
                              className="text-gray-600 hover:text-black transition"
                            >
                              ✏️
                            </a>
                          </Tooltip.Trigger>
                          <Tooltip.Content className="bg-black text-white px-2 py-1 rounded text-xs shadow">
                            Einladung bearbeiten oder drucken
                          </Tooltip.Content>
                        </Tooltip.Root>
                      )}

                      {/* Löschen */}
                      <button
                        onClick={() => deleteInvitation(inv.id)}
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
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    Keine aktiven Einladungen vorhanden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
