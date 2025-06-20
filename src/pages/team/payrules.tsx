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
  createdAt: string;
};

export default function PayrulesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payrules, setPayrules] = useState<PayRule[]>([]);
  const [editingRule, setEditingRule] = useState<PayRule | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      toast.success('Lohnregel gelöscht', { position: 'top-center' });
    } catch {
      toast.error('Löschen fehlgeschlagen', { position: 'top-center' });
    }
  };

  const handleUpdate = (updated: PayRule) => {
    setPayrules((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
    );
    setEditingRule(null);
    toast.success('Lohnregel aktualisiert', { position: 'top-center' });
  };

  const handleCreate = (newRule: PayRule) => {
    setShowCreateModal(false);
    setPayrules((prev) => [...prev, newRule]);
    toast.success('Lohnregel erstellt', { position: 'top-center' });
  };

  return (
    <TeamLayout>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lohnregeln</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Neue Regel erstellen
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Lade Lohnregeln…</div>
        ) : payrules.length === 0 ? (
          <div className="text-center text-gray-400 italic">
            Noch keine Lohnregeln hinterlegt.
          </div>
        ) : (
          <table className="w-full border mt-6 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="p-2">Bezeichnung</th>
                <th className="p-2">Typ</th>
                <th className="p-2">Satz</th>
                <th className="p-2">Erstellt am</th>
                <th className="p-2">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {payrules.map((rule) => (
                <tr key={rule.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-2">{rule.title}</td>
                  <td className="p-2">{rule.type === 'HOURLY' ? 'Stunde' : 'Monat'}</td>
                  <td className="p-2">
                    {rule.rate.toFixed(2).replace('.', ',')} €
                  </td>
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
