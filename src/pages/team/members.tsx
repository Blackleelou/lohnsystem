import { useEffect, useState } from 'react';
import TeamLayout from '@/components/team/TeamLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';

type Member = {
  id: string;
  name?: string | null;
  nickname?: string | null;
  email: string;
  role?: string | null;
  invited?: boolean;
  accepted?: boolean;
  showName?: boolean;
  showNickname?: boolean;
  showEmail?: boolean;
};

export default function TeamMembersPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [roleChangeSuccess, setRoleChangeSuccess] = useState<string | null>(null);
  const [showConfirmId, setShowConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (session?.user?.companyId === null) {
      router.replace('/dashboard');
      return;
    }

    fetch('/api/team/members')
      .then((res) => {
        if (!res.ok) throw new Error('Fehler beim Laden');
        return res.json();
      })
      .then((data) => setMembers(data.members || []))
      .catch(() => toast.error('Fehler beim Laden der Mitglieder.'))
      .finally(() => setLoading(false));
  }, [status]);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.name?.toLowerCase() || '').includes(q) ||
      (m.nickname?.toLowerCase() || '').includes(q) ||
      m.email.toLowerCase().includes(q)
    );
  });

  const handleRemove = async (id: string) => {
    setShowConfirmId(null);
    setLoading(true);

    try {
      const res = await fetch('/api/team/remove-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Fehler beim Entfernen.');
        return;
      }

      setMembers((prev) => prev.filter((m) => m.id !== id));

      if (id === session?.user?.id) {
        toast.dismiss('left-team');
        toast.success('Du hast das Team verlassen.', { id: 'left-team' });
        await update();
        router.replace('/dashboard');
      } else {
        toast.dismiss('left-team');
        toast.success('Mitglied erfolgreich entfernt.', { id: 'left-team' });
      }
    } catch (err) {
      toast.error('Netzwerk- oder Serverfehler.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const res = await fetch('/api/team/change-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole }),
    });

    if (res.ok) {
      setMembers((prev) => prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m)));
      if (userId === session?.user?.id) await update();
      setRoleChangeSuccess('Rolle erfolgreich geändert');
      setTimeout(() => setRoleChangeSuccess(null), 2500);
    } else {
      toast.error('Rollenänderung fehlgeschlagen.');
    }
  };

  const getStatus = (m: Member) => {
    if (m.invited && !m.accepted) return { text: 'Eingeladen', color: 'text-yellow-600' };
    return { text: 'Aktiv', color: 'text-green-600' };
  };

  const isAdmin = session?.user?.role === 'admin';

  return (
    <TeamLayout>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Teammitglieder</h1>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suche nach Name, E-Mail oder Nickname"
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
          />
        </div>

        {roleChangeSuccess && (
          <div className="mb-4 text-green-600 font-semibold">✅ {roleChangeSuccess}</div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Lade Mitglieder…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Keine Mitglieder gefunden.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((m) => {
              const status = getStatus(m);

              return (
                <div
                  key={m.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2 shadow-sm"
                >
                  <div>
                    <strong>Name:</strong>{' '}
                    {m.showName ? m.name || '—' : <i className="text-gray-400">privat</i>}
                  </div>
                  <div>
                    <strong>Nickname:</strong>{' '}
                    {m.showNickname ? m.nickname || '—' : <i className="text-gray-400">privat</i>}
                  </div>
                  <div>
                    <strong>E-Mail:</strong>{' '}
                    {m.showEmail ? m.email : <i className="text-gray-400">privat</i>}
                  </div>
                  <div>
                    <strong>Status:</strong>{' '}
                    <span className={status.color}>{status.text}</span>
                  </div>
                  <div>
                    <strong>Rolle:</strong>{' '}
                    {isAdmin ? (
                      <select
                        value={m.role ?? 'viewer'}
                        onChange={(e) => handleRoleChange(m.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-800 w-full"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className="text-xs text-gray-500 italic">{m.role || 'viewer'}</span>
                    )}
                  </div>
                  <div>
                    {isAdmin ? (
                      <button
                        onClick={() => setShowConfirmId(m.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Entfernen
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Keine Berechtigung</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Mitglied wirklich entfernen?
            </h3>
            <p className="text-sm text-red-500 mb-4">
              Möchtest du dieses Mitglied wirklich aus dem Team entfernen?
              {showConfirmId === session?.user?.id && (
                <>
                  <br />
                  Achtung: Du verlässt damit das Team selbst!
                </>
              )}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleRemove(showConfirmId)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded px-3 py-1 transition"
              >
                Ja, entfernen
              </button>
              <button
                onClick={() => setShowConfirmId(null)}
                className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium rounded px-3 py-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </TeamLayout>
  );
}
