import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

export type PayRule = {
  id: string;
  title: string;
  rate: number;
  type: 'HOURLY' | 'MONTHLY';
  group?: string;
  createdAt: string;
};

interface Props {
  rule: PayRule | null;
  onClose: () => void;
  onSave: (updated: PayRule) => void;
}

export default function EditPayruleModal({ rule, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [rate, setRate] = useState('');
  const [type, setType] = useState<'HOURLY' | 'MONTHLY'>('HOURLY');
  const [group, setGroup] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rule) {
      setTitle(rule.title);
      setRate(rule.rate.toString().replace('.', ','));
      setType(rule.type);
      setGroup(rule.group || '');
    }
  }, [rule]);

  const handleSave = async () => {
    const parsedRate = parseFloat(rate.replace(',', '.'));

    if (!title.trim() || isNaN(parsedRate)) {
      toast.error('Bitte gültige Bezeichnung und Betrag eingeben', { position: 'top-center' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/team/payrules/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rule?.id,
          title: title.trim(),
          rate: parsedRate,
          type,
          group: group.trim() || null, // ✅ Gruppe mitsenden
        }),
      });

      if (!res.ok) throw new Error();
      const updated: PayRule = await res.json();
      onSave(updated);
    } catch {
      toast.error('Fehler beim Speichern', { position: 'top-center' });
    } finally {
      setSaving(false);
    }
  };

  if (!rule) return null;

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
        <Dialog.Title className="text-lg font-bold mb-4">Lohneinstellung bearbeiten</Dialog.Title>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Bezeichnung</label>
            <input
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Betrag (€)</label>
            <input
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
              value={rate}
              onChange={e => setRate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Typ</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as 'HOURLY' | 'MONTHLY')}
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
            >
              <option value="HOURLY">Stundenlohn</option>
              <option value="MONTHLY">Monatsgehalt</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Gruppe (optional)</label>
            <input
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
              value={group}
              onChange={e => setGroup(e.target.value)}
              placeholder="z. B. E1 oder Zuschläge"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:underline">
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {saving ? 'Speichern…' : 'Speichern'}
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
