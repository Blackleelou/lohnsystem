// src/pages/team/payrules.tsx
import { useEffect, useState } from 'react';
import TeamLayout from '@/components/team/TeamLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import EditPayruleModal from '@/components/modals/EditPayruleModal';
import CreatePayruleModal from '@/components/modals/CreatePayruleModal';
import { Info, Plus, Pencil, Trash2 } from 'lucide-react';

export type PayRule = {
  id: string;
  title: string;
  rate: number;
  type: 'HOURLY' | 'MONTHLY';
  group?: string;
  createdAt: string;
};

function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span className="group relative cursor-pointer text-gray-400">
      <Info className="w-4 h-4" />
      <span className="absolute z-50 hidden group-hover:block bg-white border rounded px-3 py-2 text-xs text-gray-700 shadow-lg w-64 top-6 left-1/2 -translate-x-1/2">
        {children}
      </span>
    </span>
  );
}

export default function PayrulesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payrules, setPayrules] = useState<PayRule[]>([]);
  const [editingRule, setEditingRule] = useState<PayRule | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Lohneinstellungen
            <Tooltip>
              Hier kannst du Lohnarten (Stunde oder Monat), Zuschläge, Feiertagszuschläge
              und weitere Besonderheiten deiner Firma festlegen.
            </Tooltip>
          </h1>

          <button
            onClick={() => setShowCreateModal(true)}
            className="text-blue-600 hover:text-blue-800"
            title="Neue Lohneinstellung"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Gruppenleiste */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
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
                    <td className="p-2">{rule.rate.toFixed(2).replace('.', ',')} €</td>
                    <td className="p-2 flex gap-3">
                      <button onClick={() => setEditingRule(rule)} title="Bearbeiten">
                        <Pencil className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                      </button>
                      <button onClick={() => handleDelete(rule.id)} title="Löschen">
                        <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
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
