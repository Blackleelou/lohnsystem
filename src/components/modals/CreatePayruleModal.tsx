import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

export interface PayRule {
  id: string;
  title: string;
  rate: number;
  type: 'HOURLY' | 'MONTHLY';
  group?: string;
  createdAt: string;
}

interface Props {
  onClose: () => void;
  onCreate: (newRule: PayRule) => void;
}

export default function CreatePayruleModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [rate, setRate] = useState('');
  const [type, setType] = useState<'HOURLY' | 'MONTHLY'>('HOURLY');
  const [group, setGroup] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const parsedRate = parseFloat(rate.replace(',', '.'));
    if (!title.trim() || isNaN(parsedRate) || parsedRate <= 0) {
      toast.error('Bitte gültige Angaben machen', { position: 'top-center' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/team/payrules/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          rate: parsedRate,
          type,
          group: group.trim() || null, // leere Gruppe als null senden
        }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      onCreate(data);
      onClose();
    } catch {
      toast.error('Erstellen fehlgeschlagen', { position: 'top-center' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6">
        <Dialog.Title className="text-lg font-bold mb-4">Neue Lohneinstellung</Dialog.Title>

        {/* Bezeichnung */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Bezeichnung</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-800"
            placeholder="z. B. Nachtschicht"
          />
        </div>

        {/* Gruppe */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Gruppe (optional)</label>
          <input
            type="text"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-800"
            placeholder="z. B. E1 oder Zuschläge"
          />
        </div>

        {/* Typ */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Typ</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="HOURLY"
                checked={type === 'HOURLY'}
                onChange={() => setType('HOURLY')}
              />
              Stundenlohn
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="MONTHLY"
                checked={type === 'MONTHLY'}
                onChange={() => setType('MONTHLY')}
              />
              Monatsgehalt
            </label>
          </div>
        </div>

        {/* Betrag */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">
            {type === 'HOURLY' ? 'Stundensatz (€)' : 'Monatsgehalt (€)'}
          </label>
          <input
            type="text"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-800"
            placeholder={type === 'HOURLY' ? 'z. B. 17,50' : 'z. B. 2800'}
          />
        </div>

        {/* Aktionen */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white">
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700">
            {saving ? 'Speichern…' : 'Erstellen'}
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
