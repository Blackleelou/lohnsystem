// src/components/modals/CreatePayruleModal.tsx

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import type { PayRule } from '@/types/PayRule';


interface Props {
  onClose: () => void;
  onCreate: (newRule: PayRule) => void;
  prefillGroup?: string | null;
  existingGroups: string[];
}

export default function CreatePayruleModal({ onClose, onCreate, prefillGroup, existingGroups }: Props) {
  const [title, setTitle] = useState('');
  const [rate, setRate] = useState('');
  const [type, setType] = useState<'HOURLY' | 'MONTHLY'>('HOURLY');
  const [ruleKind, setRuleKind] = useState<'PAY' | 'BONUS' | 'SPECIAL'>('PAY');
  const [percent, setPercent] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [onlyDecember, setOnlyDecember] = useState(false);
  const [onlyAdmins, setOnlyAdmins] = useState(false);
  const [oncePerYear, setOncePerYear] = useState(false);
  const [referenceType, setReferenceType] = useState<'BASE_SALARY' | 'ACTUAL_HOURS' | 'FIXED_AMOUNT'>('FIXED_AMOUNT');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [saving, setSaving] = useState(false);
  const [group, setGroup] = useState(prefillGroup || '');


  const handleSave = async () => {
    const parsedRate = parseFloat(rate.replace(',', '.'));
    const parsedPercent = parseFloat(percent.replace(',', '.'));
    const parsedFixed = parseFloat(fixedAmount.replace(',', '.'));

    if (!title.trim()) {
      toast.error('Bezeichnung fehlt', { position: 'top-center' });
      return;
    }

    if (ruleKind === 'PAY' && (isNaN(parsedRate) || parsedRate <= 0)) {
      toast.error('Gültiger Betrag erforderlich', { position: 'top-center' });
      return;
    }

    if (ruleKind === 'BONUS' && (isNaN(parsedPercent) || parsedPercent <= 0)) {
      toast.error('Gültiger Prozentsatz erforderlich', { position: 'top-center' });
      return;
    }

    if (ruleKind === 'SPECIAL' && (isNaN(parsedFixed) || parsedFixed <= 0)) {
      toast.error('Gültiger Festbetrag erforderlich', { position: 'top-center' });
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
          group: group.trim() || null,
          ruleKind,
          percent: ruleKind === 'BONUS' ? parsedPercent : null,
          fixedAmount: ruleKind === 'SPECIAL' ? parsedFixed : null,
          onlyDecember: ruleKind === 'SPECIAL' ? onlyDecember : undefined,
          onlyAdmins: ruleKind === 'SPECIAL' ? onlyAdmins : undefined,
          oncePerYear: ruleKind === 'SPECIAL' ? oncePerYear : undefined,
          referenceType: ruleKind === 'SPECIAL' ? referenceType : undefined,
          validFrom: ruleKind === 'SPECIAL' ? validFrom || null : undefined,
          validUntil: ruleKind === 'SPECIAL' ? validUntil || null : undefined,
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

        {/* Regeltyp */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Regeltyp</label>
          <select
            value={ruleKind}
            onChange={(e) => setRuleKind(e.target.value as any)}
            className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-800">
            <option value="PAY">Grundlohn (Stunde / Monat)</option>
            <option value="BONUS">Zuschlag (z. B. Nachtschicht)</option>
            <option value="SPECIAL">Sonderzahlung (z. B. Urlaubsgeld)</option>
          </select>
        </div>

        {/* Bezeichnung */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Bezeichnung</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-800"
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
          />
        </div>

        {/* PAY Felder */}
        {ruleKind === 'PAY' && (
          <>
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
            <div className="mb-6">
              <label className="block mb-1 text-sm font-medium">
                {type === 'HOURLY' ? 'Stundensatz (€)' : 'Monatsgehalt (€)'}
              </label>
              <input
                type="text"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-800"
              />
            </div>
          </>
        )}

        {/* BONUS Feld */}
        {ruleKind === 'BONUS' && (
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">Zuschlag (%)</label>
            <input
              type="text"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-800"
            />
          </div>
        )}

        {/* SPECIAL Felder */}
        {ruleKind === 'SPECIAL' && (
          <>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Festbetrag (€)</label>
              <input
                type="text"
                value={fixedAmount}
                onChange={(e) => setFixedAmount(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-800"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Bezug</label>
              <select
                value={referenceType}
                onChange={(e) =>
                  setReferenceType(e.target.value as any)
                }
                className="w-full rounded border px-3 py-2 text-sm dark:bg-gray-800"
              >
                <option value="BASE_SALARY">Grundgehalt</option>
                <option value="ACTUAL_HOURS">Tatsächliche Stunden</option>
                <option value="FIXED_AMOUNT">Fester Betrag</option>
              </select>
            </div>

            <div className="mb-4 flex flex-col gap-2">
              <label className="block text-sm font-medium">Gültigkeitszeitraum</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="flex-1 rounded border px-3 py-2 text-sm dark:bg-gray-800"
                  placeholder="Von"
                />
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="flex-1 rounded border px-3 py-2 text-sm dark:bg-gray-800"
                  placeholder="Bis"
                />
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-2">
              <label className="block text-sm font-medium">Optionen</label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyDecember}
                  onChange={() => setOnlyDecember(!onlyDecember)}
                />
                Nur im Dezember auszahlen
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyAdmins}
                  onChange={() => setOnlyAdmins(!onlyAdmins)}
                />
                Nur für Admins sichtbar
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={oncePerYear}
                  onChange={() => setOncePerYear(!oncePerYear)}
                />
                Max. 1× pro Jahr
              </label>
            </div>
          </>
        )}

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
