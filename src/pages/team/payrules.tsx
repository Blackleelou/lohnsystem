import { useEffect, useState } from 'react';
import TeamLayout from '@/components/team/TeamLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import EditPayruleModal from '@/components/modals/EditPayruleModal';
import CreatePayruleModal from '@/components/modals/CreatePayruleModal';

export type PayRule = {
  id: string;
  title: string;
  rate: number;
  type: 'HOURLY' | 'MONTHLY';
  group?: string;
  createdAt: string;
};

export default function PayrulesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payrules, setPayrules] = useState<PayRule[]>([]);
  const [editingRule, setEditingRule] = useState<PayRule | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;

    if (!session?.user?.companyId) {
      toast.error('Keine Firma zugeordnet.');
      router.replace('/dashboard');
      return;
    }

    const loadPayrules = async () => {
      try {
        const res = await fetch('/api/team/payrules');
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err?.error || 'Fehler beim Laden');
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setPayrules(data);
        } else {
          throw new Error('Ungültige Serverantwort');
        }
      } catch (err: any) {
        toast.error('Fehler: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPayrules();
  }, [status, session?.user?.companyId]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/team/payrules/delete?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Fehler beim Löschen');
      setPayrules((prev) => prev.filter((r) => r.id !== id));
      toast.success('Lohneinstellung gelöscht', { position: 'top-center' });
    } catch {
      toast.error('Löschen fehlgeschlagen', { position: 'top-center' });
    }
  };

  const handleUpdate = (updated: PayRule) => {
    setPayrules((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
    );
    setEditingRule(null);
    toast.success('Lohneinstellung aktualisiert', { position: 'top-center' });
  };

  const handleCreate = (newRule: PayRule) => {
    setShowCreateModal(false);
    setPayrules((prev) => [...prev, newRule]);
    toast.success('Lohneinstellung erstellt', { position: 'top-center' });
  };

  const groups = Array.from(new Set(payrules.map(r => r.group || 'Allgemein')));

  return (
    <TeamLayout>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        {/* Titel + Info */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Lohneinstellungen</h1>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-blue-600 hover:underline text-sm"
          >
            ❓
          </button>
        </div>

        {showInfo && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm mb-4">
            In den Lohneinstellungen kannst du:
            <ul className="list-disc list-inside mt-2">
              <li>Stunden- oder Monatslöhne anlegen</li>
              <li>Zuschläge wie Nacht- oder Feiertagszuschläge definieren</li>
              <li>Firmenspezifische Besonderheiten erfassen</li>
              <li>Einträge in Gruppen sortieren – z. B. „E1“, „Zuschläge“ usw.</li>
            </ul>
          </div>
        )}

        {/* Plus + Gruppen */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            ➕ Neue Lohneinstellung
          </button>

          {groups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`
                px-3 py-1 text-sm rounded-md border transition
                ${selectedGroup === group
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
              `}
              style={{ fontWeight: selectedGroup === group ? '600' : '400' }}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Tabelle */}
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Lade Lohneinstellungen…</div>
        ) : payrules.length === 0 ? (
          <div className="text-center text-gray-400 italic">
            Noch keine Lohneinstellungen hinterlegt.
          </div>
        ) : (
          <table className="w-full border mt-4 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="p-2">Bezeichnung</th>
                <th className="p-2">Typ</th>
                <th className="p-2">Satz</th>
                <th className="p-2">Gruppe</th>
                <th className="p-2">Erstellt am</th>
                <th className="p-2">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {payrules
                .filter((r) =>
                  selectedGroup === null
                    ? true
                    : r.group === selectedGroup || (selectedGroup === 'Allgemein' && !r.group)
                )
                .map((rule) => (
                  <tr key={rule.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-2">{rule.title}</td>
                    <td className="p-2">{rule.type === 'HOURLY' ? 'Stunde' : 'Monat'}</td>
                    <td className="p-2">
                      {rule.rate.toFixed(2).replace('.', ',')} €
                    </td>
                    <td className="p-2">{rule.group || '–'}</td>
                    <td className="p-2">{new Date(rule.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 flex gap-4">
                      <button
                        onClick={() => setEditingRule(rule)}
                        className="text-blue-600 hover:underline"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="text-red-600 hover:underline"
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {editingRule && (
        <EditPayruleModal
          rule={editingRule}
          onClose={() => setEditingRule(null)}
          onSave={handleUpdate}
        />
      )}

      {showCreateModal && (
        <CreatePayruleModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </TeamLayout>
  );
}
