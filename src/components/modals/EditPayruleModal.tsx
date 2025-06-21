import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import FormField from '@/components/ui/FormField';
import type { PayRule } from '@/types/PayRule';

interface Props {
  onClose: () => void;
  onCreate: (newRule: PayRule) => void;
  prefillGroup?: string | null;
  existingGroups: string[];
}

export default function CreatePayruleModal({
  onClose,
  onCreate,
  prefillGroup,
  existingGroups
}: Props) {
  /* ---------- State ---------- */
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

  /* ---------- Save ---------- */
  const handleSave = async () => {
    const parsedRate = parseFloat(rate.replace(',', '.'));
    const parsedPercent = parseFloat(percent.replace(',', '.'));
    const parsedFixed = parseFloat(fixedAmount.replace(',', '.'));

    if (!title.trim()) return toast.error('Bezeichnung fehlt', { position: 'top-center' });
    if (ruleKind === 'PAY' && (isNaN(parsedRate) || parsedRate <= 0))
      return toast.error('Gültiger Betrag erforderlich', { position: 'top-center' });
    if (ruleKind === 'BONUS' && (isNaN(parsedPercent) || parsedPercent <= 0))
      return toast.error('Gültiger Prozentsatz erforderlich', { position: 'top-center' });
    if (ruleKind === 'SPECIAL' && (isNaN(parsedFixed) || parsedFixed <= 0))
      return toast.error('Gültiger Festbetrag erforderlich', { position: 'top-center' });

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
          validUntil: ruleKind === 'SPECIAL' ? validUntil || null : undefined
        })
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

  /* ---------- UI ---------- */
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-2xl p-8 space-y-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Neue Lohneinstellung</DialogTitle>
        </DialogHeader>

        {/* Grid-Layout */}
        <div className="grid gap-5">
          {/* Regeltyp */}
          <FormField label="Regeltyp">
            <Select value={ruleKind} onValueChange={(v) => setRuleKind(v as any)}>
              <SelectTrigger className="w-full input-field" />
              <SelectContent>
                <SelectItem value="PAY">Grundlohn (Std./Monat)</SelectItem>
                <SelectItem value="BONUS">Zuschlag (z. B. Nacht)</SelectItem>
                <SelectItem value="SPECIAL">Sonderzahlung (Urlaub)</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {/* Bezeichnung */}
          <FormField label="Bezeichnung" htmlFor="title">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field w-full"
            />
          </FormField>

          {/* Gruppe */}
          <FormField label="Gruppe (optional)" htmlFor="group">
            <input
              id="group"
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              list="group-list"
              className="input-field w-full"
            />
            <datalist id="group-list">
              {existingGroups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </FormField>

          {/* PAY */}
          {ruleKind === 'PAY' && (
            <>
              <FormField label="Typ">
                <RadioGroup value={type} onValueChange={(v) => setType(v as any)} className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="HOURLY" id="hourly" /> <label htmlFor="hourly">Stundenlohn</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="MONTHLY" id="monthly" /> <label htmlFor="monthly">Monatsgehalt</label>
                  </div>
                </RadioGroup>
              </FormField>

              <FormField label={type === 'HOURLY' ? 'Stundensatz (€)' : 'Monatsgehalt (€)'} htmlFor="rate">
                <input
                  id="rate"
                  type="text"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="input-field w-full"
                />
              </FormField>
            </>
          )}

          {/* BONUS */}
          {ruleKind === 'BONUS' && (
            <FormField label="Zuschlag (%)" htmlFor="percent">
              <input
                id="percent"
                type="text"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                className="input-field w-full"
              />
            </FormField>
          )}

          {/* SPECIAL */}
          {ruleKind === 'SPECIAL' && (
            <>
              <FormField label="Festbetrag (€)" htmlFor="fixed">
                <input
                  id="fixed"
                  type="text"
                  value={fixedAmount}
                  onChange={(e) => setFixedAmount(e.target.value)}
                  className="input-field w-full"
                />
              </FormField>

              <FormField label="Bezug">
                <Select value={referenceType} onValueChange={(v) => setReferenceType(v as any)}>
                  <SelectTrigger className="w-full input-field" />
                  <SelectContent>
                    <SelectItem value="BASE_SALARY">Grundgehalt</SelectItem>
                    <SelectItem value="ACTUAL_HOURS">Tatsächliche Stunden</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Fester Betrag</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              {/* Gültigkeit */}
              <FormField label="Gültigkeitszeitraum">
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="input-field flex-1"
                  />
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="input-field flex-1"
                  />
                </div>
              </FormField>

              {/* Optionen */}
              <FormField label="Optionen">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Nur im Dezember auszahlen</span>
                    <Switch checked={onlyDecember} onCheckedChange={setOnlyDecember} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nur für Admins sichtbar</span>
                    <Switch checked={onlyAdmins} onCheckedChange={setOnlyAdmins} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Max. 1× pro Jahr</span>
                    <Switch checked={oncePerYear} onCheckedChange={setOncePerYear} />
                  </div>
                </div>
              </FormField>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving && <Loader2 className="animate-spin w-4 h-4" />}
            {!saving && 'Erstellen'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
