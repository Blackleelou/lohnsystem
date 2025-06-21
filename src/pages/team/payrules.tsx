import { useEffect, useState } from 'react';
import TeamLayout from '@/components/team/TeamLayout';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import EditPayruleModal from '@/components/modals/EditPayruleModal';
import CreatePayruleModal from '@/components/modals/CreatePayruleModal';
import { Info, Plus, Pencil, Trash2, Save } from 'lucide-react';
import { PayRule } from '@/types/PayRule';
import ClientOnly from '@/components/ClientOnly';

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

function ConfirmModal({
  visible,
  onConfirm,
  onCancel,
  groupName,
}: {
  visible: boolean;
  groupName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Gruppe löschen</h2>
        <p className="text-sm mb-6">
          Möchtest du die Gruppe <strong>{groupName}</strong> und alle zugehörigen Regeln wirklich löschen?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
            Abbrechen
          </button>
          <button onClick={onConfirm} className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
}

function PayrulesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payrules, setPayrules] = useState<PayRule[]>([]);
  const [editingRule, setEditingRule] = useState<PayRule | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [preselectedGroup, setPreselectedGroup] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editedGroupName, setEditedGroupName] = useState<string>('');

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
          // initial group
          if (!selectedGroup) {
            const groups = Array.from(new Set(data.map(r => r.group?.trim() || 'Allgemein')));
            groups.sort((a, b) => {
              if (a === 'Allgemein') return -1;
              if (b === 'Allgemein') return 1;
              const aNum = extractGroupNumber(a);
              const bNum = extractGroupNumber(b);
              if (aNum !== bNum) return aNum - bNum;
              return a.localeCompare(b, 'de', { sensitivity: 'base' });
            });
            if (groups.length > 0) setSelectedGroup(groups[0]);
          }
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
      const res = await fetch(`/api/team/payrules/delete?id=${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Fehler beim Löschen');
      setPayrules(prev => prev.filter(r => r.id !== id));
      toast.success('Lohneinstellung gelöscht', { position: 'top-center' });
    } catch {
      toast.error('Löschen fehlgeschlagen', { position: 'top-center' });
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    try {
      const res = await fetch(`/api/team/payrules/delete-group?group=${encodeURIComponent(selectedGroup)}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Fehler beim Löschen');
      setPayrules(prev => prev.filter(r => (r.group || 'Allgemein') !== selectedGroup));
      toast.success(`Gruppe "${selectedGroup}" gelöscht`, { position: 'top-center' });
      setSelectedGroup(null);
    } catch {
      toast.error('Gruppenlöschung fehlgeschlagen', { position: 'top-center' });
    } finally {
      setShowConfirmModal(false);
    }
  };

const handleRenameGroup = async () => {
  if (!editingGroup || !editedGroupName.trim()) return;

  try {
    const res = await fetch('/api/team/payrules/rename-group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        oldName: editingGroup,
        newName: editedGroupName.trim(),
      }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || 'Umbenennen fehlgeschlagen');
    }

    const { updatedCount } = await res.json();

    // Nur nach erfolgreichem DB-Write das UI-State updaten
    setPayrules(prev =>
      prev.map(r =>
        (r.group || 'Allgemein') === editingGroup
          ? { ...r, group: editedGroupName.trim() }
          : r
      )
    );
    setSelectedGroup(editedGroupName.trim());
    setEditingGroup(null);
    toast.success(`Gruppe umbenannt (${updatedCount} Regeln)`);
  } catch (err: any) {
    toast.error(err.message);
  }
};


  const handleUpdate = (updated: PayRule) => {
    setPayrules(prev => prev.map(r => r.id === updated.id ? updated : r));
    setEditingRule(null);
    toast.success('Lohneinstellung aktualisiert', { position: 'top-center' });
  };

  const handleCreate = (newRule: PayRule) => {
    setShowCreateModal(false);
    setPayrules(prev => [...prev, newRule]);
    toast.success('Lohneinstellung erstellt', { position: 'top-center' });
  };

  function extractGroupNumber(group: string): number {
    const match = group.match(/\d+/);
    return match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
  }

  const groups = Array.from(new Set(payrules.map(r => r.group?.trim() || 'Allgemein')))
    .sort((a, b) => {
      if (a === 'Allgemein') return -1;
      if (b === 'Allgemein') return 1;
      const aNum = extractGroupNumber(a);
      const bNum = extractGroupNumber(b);
      if (aNum !== bNum) return aNum - bNum;
      return a.localeCompare(b, 'de', { sensitivity: 'base' });
    });

  return (
    <TeamLayout>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Lohneinstellungen
            <Tooltip>
              Hier kannst du Lohnarten (Stunde oder Monat), Zuschläge, Feiertagszuschläge und weitere Besonderheiten deiner Firma festlegen.
            </Tooltip>
          </h1>
          <button onClick={() => { setShowCreateModal(true); setPreselectedGroup(null); }} className="text-blue-600 hover:text-blue-800" title="Neue Lohneinstellung">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          {groups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-3 py-1 text-sm rounded-md border transition ${selectedGroup === group ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              style={{ fontWeight: selectedGroup === group ? '600' : '400' }}
            >
              {group}
            </button>
          ))}
        </div>

        {selectedGroup && (
          <div className="flex items-center justify-between mb-4 border-b pb-1">
            <div className="text-lg font-semibold flex items-center gap-3">
              {editingGroup === selectedGroup ? (
                <>  
                  <input
                    type="text"
                    className="border px-2 py-1 rounded text-sm"
                    value={editedGroupName}
                    onChange={e => setEditedGroupName(e.target.value)}
                  />
                  <button onClick={handleRenameGroup} title="Speichern">
                    <Save className="w-5 h-5 text-green-600 hover:text-green-800" />
                  </button>
                </>
              ) : (
                <>
                  {selectedGroup}
                  <button onClick={() => { setEditingGroup(selectedGroup); setEditedGroupName(selectedGroup); }} title="Gruppe umbenennen">
                    <Pencil className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                  </button>
                </>
              )}
              <button onClick={() => { setShowCreateModal(true); setPreselectedGroup(selectedGroup); }} title="Neue Regel in dieser Gruppe">
                <Plus className="w-5 h-5 text-green-600 hover:text-green-800" />
              </button>
              <button onClick={() => setShowConfirmModal(true)} title="Gruppe löschen">
                <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" />
              </button>
            </div>
          </div>
        )}

        {/* Tabelle und Modals wie gehabt */}
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Lade Lohneinstellungen…</div>
        ) : payrules.length === 0 ? (
          <div className="text-center text-gray-400 italic">Noch keine Lohneinstellungen hinterlegt.</div>
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
                .filter(rule => (rule.group || 'Allgemein') === selectedGroup)
                .sort((a,b) => a.title.localeCompare(b.title,'de',{numeric:true}))
                .map(rule => (
                  <tr key={rule.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-2">{rule.title}</td>
                    <td className="p-2">{rule.type==='HOURLY'?'Stunde':'Monat'}</td>
                    <td className="p-2">
                      {rule.ruleKind==='BONUS' && !isNaN(Number(rule.percent))? `${Number(rule.percent).toFixed(2).replace('.',',')} %`
                      : rule.ruleKind==='PAY' && !isNaN(Number(rule.rate))? `${Number(rule.rate).toFixed(2).replace('.',',')} €`
                      : rule.ruleKind==='SPECIAL' && !isNaN(Number(rule.fixedAmount))? `${Number(rule.fixedAmount).toFixed(2).replace('.',',')} €`
                      : '–'}
                    </td>
                    <td className="p-2 flex gap-3">
                      <button onClick={()=>setEditingRule(rule)} title="Bearbeiten">
                        <Pencil className="w-4 h-4 text-blue-600 hover:text-blue-800"/>
                      </button>
                      <button onClick={()=>handleDelete(rule.id)} title="Löschen">
                        <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800"/>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {editingRule && (
          <EditPayruleModal rule={editingRule} onClose={()=>setEditingRule(null)} onSave={handleUpdate} />
        )}

        {showCreateModal && (
          <CreatePayruleModal onClose={()=>{setShowCreateModal(false);setPreselectedGroup(null)}} onCreate={handleCreate} prefillGroup={preselectedGroup} existingGroups={groups} />
        )}

        <ConfirmModal visible={showConfirmModal} onConfirm={handleDeleteGroup} onCancel={()=>setShowConfirmModal(false)} groupName={selectedGroup||''}/>
      </div>
    </TeamLayout>
  );
}

export default function PayrulesPageWrapper() {
  return (
    <ClientOnly>
      <PayrulesPage />
    </ClientOnly>
  );
}
