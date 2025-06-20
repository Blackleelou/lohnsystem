// src/components/modals/EditPayruleModal.tsx

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';

export type PayRule = {
  id: string;
  title: string;
  rate: number | null;
  percent?: number | null;
  fixedAmount?: number | null;
  type?: 'HOURLY' | 'MONTHLY';
  ruleKind: 'PAY' | 'BONUS' | 'SPECIAL';
  group?: string;
  createdAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  onlyDecember?: boolean;
  onlyForAdmins?: boolean;
  perYear?: boolean;
  referenceType?: 'BASE_SALARY' | 'ACTUAL_HOURS' | 'FIXED_AMOUNT';
};

interface Props {
  rule: PayRule | null;
  onClose: () => void;
  onSave: (updated: PayRule) => void;
}

export default function EditPayruleModal({ rule, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [rate, setRate] = useState('');
  const [percent, setPercent] = useState('');
  const [fixedAmount, setFixedAmount] = useState('');
  const [type, setType] = useState<'HOURLY' | 'MONTHLY'>('HOURLY');
  const [group, setGroup] = useState('');
  const [ruleKind, setRuleKind] = useState<'PAY' | 'BONUS' | 'SPECIAL'>('PAY');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [onlyDecember, setOnlyDecember] = useState(false);
  const [onlyForAdmins, setOnlyForAdmins] = useState(false);
  const [perYear, setPerYear] = useState(false);
  const [referenceType, setReferenceType] = useState<'BASE_SALARY' | 'ACTUAL_HOURS' | 'FIXED_AMOUNT'>('BASE_SALARY');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rule) {
      setTitle(rule.title);
      setGroup(rule.group || '');
      setRate(rule.rate?.toString().replace('.', ',') || '');
      setPercent(rule.percent?.toString().replace('.', ',') || '');
      setFixedAmount(rule.fixedAmount?.toString().replace('.', ',') || '');
      setType(rule.type || 'HOURLY');
      setRuleKind(rule.ruleKind);
      setValidFrom(rule.validFrom?.slice(0, 10) || '');
      setValidUntil(rule.validUntil?.slice(0, 10) || '');
      setOnlyDecember(!!rule.onlyDecember);
      setOnlyForAdmins(!!rule.onlyForAdmins);
      setPerYear(!!rule.perYear);
      setReferenceType(rule.referenceType || 'BASE_SALARY');
    }
  }, [rule]);

  const handleSave = async () => {
    const parsedRate = parseFloat(rate.replace(',', '.'));
    const parsedPercent = parseFloat(percent.replace(',', '.'));
    const parsedFixed = parseFloat(fixedAmount.replace(',', '.'));

    if (!title.trim()) {
      toast.error('Bitte gültige Bezeichnung eingeben', { position: 'top-center' });
      return;
    }

    if (ruleKind === 'PAY' && (isNaN(parsedRate) || parsedRate <= 0)) {
      toast.error('Bitte gültigen Stundensatz eingeben', { position: 'top-center' });
      return;
    }

    if (ruleKind === 'BONUS' && (isNaN(parsedPercent) || parsedPercent <= 0)) {
      toast.error('Bitte gültigen Prozentwert eingeben', { position: 'top-center' });
      return;
    }

    if (ruleKind === 'SPECIAL' && (isNaN(parsedFixed) || parsedFixed <= 0)) {
      toast.error('Bitte gültigen Festbetrag eingeben', { position: 'top-center' });
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
          rate: ruleKind === 'PAY' ? parsedRate : null,
          percent: ruleKind === 'BONUS' ? parsedPercent : null,
          fixedAmount: ruleKind === 'SPECIAL' ? parsedFixed : null,
          type: ruleKind === 'PAY' ? type : null,
          group: group.trim() || null,
          ruleKind,
          validFrom: ruleKind === 'SPECIAL' ? validFrom || null : null,
          validUntil: ruleKind === 'SPECIAL' ? validUntil || null : null,
          onlyDecember: ruleKind === 'SPECIAL' ? onlyDecember : false,
          onlyForAdmins: ruleKind === 'SPECIAL' ? onlyForAdmins : false,
          perYear: ruleKind === 'SPECIAL' ? perYear : false,
          referenceType: ruleKind === 'SPECIAL' ? referenceType : null,
        }),
      });

      if (!res.ok) throw new Error();
      const updated: PayRule = await res.json();
      onSave(updated);
      onClose();
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
          {/* Regeltyp */}
          <div>
            <label className="block mb-1 text-sm">Regeltyp</label>
            <select
              value={ruleKind}
              onChange={(e) => setRuleKind(e.target.value as any)}
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
            >
              <option value="PAY">Grundlohn</option>
              <option value="BONUS">Zuschlag (%)</option>
              <option value="SPECIAL">Sonderzahlung</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Bezeichnung</label>
            <input
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Gruppe (optional)</label>
            <input
              className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
              value={group}
              onChange={e => setGroup(e.target.value)}
              placeholder="z. B. Zuschläge"
            />
          </div>

          {/* Dynamisch je nach Regeltyp */}
          {ruleKind === 'PAY' && (
            <>
              <div>
                <label className="block mb-1 text-sm">Typ</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
                >
                  <option value="HOURLY">Stundenlohn</option>
                  <option value="MONTHLY">Monatsgehalt</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm">Betrag (€)</label>
                <input
                  className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
                  value={rate}
                  onChange={e => setRate(e.target.value)}
                />
              </div>
            </>
          )}

          {ruleKind === 'BONUS' && (
            <div>
              <label className="block mb-1 text-sm">Zuschlag (%)</label>
              <input
                className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
                value={percent}
                onChange={e => setPercent(e.target.value)}
              />
            </div>
          )}

          {ruleKind === 'SPECIAL' && (
            <>
              <div>
                <label className="block mb-1 text-sm">Festbetrag (€)</label>
                <input
                  className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
                  value={fixedAmount}
                  onChange={e => setFixedAmount(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={onlyDecember} onChange={e => setOnlyDecember(e.target.checked)} />
                  <label className="text-sm">Nur im Dezember</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={onlyForAdmins} onChange={e => setOnlyForAdmins(e.target.checked)} />
                  <label className="text-sm">Nur für Admins</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={perYear} onChange={e => setPerYear(e.target.checked)} />
                  <label className="text-sm">Nur 1× pro Jahr</label>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm">Bezugsart</label>
                <select
                  value={referenceType}
                  onChange={(e) => setReferenceType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
                >
                  <option value="BASE_SALARY">Grundgehalt</option>
                  <option value="ACTUAL_HOURS">Gearbeitete Stunden</option>
                  <option value="FIXED_AMOUNT">Fester Betrag</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 text-sm">Gültig ab</label>
                  <input
                    type="date"
                    value={validFrom}
                    onChange={e => setValidFrom(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm">Gültig bis</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={e => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-900"
                  />
                </div>
              </div>
            </>
          )}

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
