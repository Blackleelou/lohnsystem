// src/components/modals/EditPayruleModal.tsx
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import FormField from '@/components/ui/FormField'
import toast from 'react-hot-toast'
import type { PayRule } from '@/types/PayRule'

interface Props {
  /** Datensatz, der bearbeitet wird */
  rule: PayRule
  /** Modal schließen (ohne Speichern) */
  onClose: () => void
  /** Callback mit aktualisiertem Datensatz */
  onSave: (updated: PayRule) => void
}

export default function EditPayruleModal({ rule, onClose, onSave }: Props) {
  /* ---------- State aus bestehender Rule ---------- */
  const [title, setTitle] = useState(rule.title)
  const [rate, setRate] = useState(rule.rate?.toString() ?? '')
  const [type, setType] = useState<'HOURLY' | 'MONTHLY'>(rule.type)
  const [ruleKind] = useState<'PAY' | 'BONUS' | 'SPECIAL'>(rule.ruleKind)
  const [percent, setPercent] = useState(rule.percent?.toString() ?? '')
  const [fixedAmount, setFixedAmount] = useState(rule.fixedAmount?.toString() ?? '')
  const [onlyDecember, setOnlyDecember] = useState(!!rule.onlyDecember)
  const [onlyAdmins, setOnlyAdmins] = useState(!!rule.onlyAdmins)
  const [oncePerYear, setOncePerYear] = useState(!!rule.oncePerYear)
  const [referenceType, setReferenceType] = useState<
    'BASE_SALARY' | 'ACTUAL_HOURS' | 'FIXED_AMOUNT'
  >(rule.referenceType ?? 'FIXED_AMOUNT')
  const [validFrom, setValidFrom] = useState(rule.validFrom ?? '')
  const [validUntil, setValidUntil] = useState(rule.validUntil ?? '')
  const [saving, setSaving] = useState(false)

  /* ---------- Save ---------- */
  async function handleSave() {
    const parsedRate = parseFloat(rate.replace(',', '.'))
    const parsedPercent = parseFloat(percent.replace(',', '.'))
    const parsedFixed = parseFloat(fixedAmount.replace(',', '.'))

    if (!title.trim()) return toast.error('Bezeichnung fehlt')
    if (ruleKind === 'PAY' && (isNaN(parsedRate) || parsedRate <= 0))
      return toast.error('Gültiger Betrag erforderlich')
    if (ruleKind === 'BONUS' && (isNaN(parsedPercent) || parsedPercent <= 0))
      return toast.error('Gültiger Prozentsatz erforderlich')
    if (ruleKind === 'SPECIAL' && (isNaN(parsedFixed) || parsedFixed <= 0))
      return toast.error('Gültiger Festbetrag erforderlich')

    setSaving(true)
    try {
      const res = await fetch('/api/team/payrules/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: rule.id,
          title: title.trim(),
          rate: parsedRate,
          type,
          percent: ruleKind === 'BONUS' ? parsedPercent : null,
          fixedAmount: ruleKind === 'SPECIAL' ? parsedFixed : null,
          onlyDecember: ruleKind === 'SPECIAL' ? onlyDecember : undefined,
          onlyAdmins: ruleKind === 'SPECIAL' ? onlyAdmins : undefined,
          oncePerYear: ruleKind === 'SPECIAL' ? oncePerYear : undefined,
          referenceType: ruleKind === 'SPECIAL' ? referenceType : undefined,
          validFrom: ruleKind === 'SPECIAL' ? validFrom || null : undefined,
          validUntil: ruleKind === 'SPECIAL' ? validUntil || null : undefined,
        }),
      })
      if (!res.ok) throw new Error()
      const updated = (await res.json()) as PayRule
      onSave(updated)
      onClose()
    } catch {
      toast.error('Speichern fehlgeschlagen')
    } finally {
      setSaving(false)
    }
  }

  /* ---------- UI ---------- */
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-2xl p-8 space-y-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Lohneinstellung bearbeiten</DialogTitle>
        </DialogHeader>

        <div className="grid gap-5">
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

          {/* PAY Felder */}
          {ruleKind === 'PAY' && (
            <>
              <FormField label="Typ">
                <RadioGroup
                  value={type}
                  onValueChange={(v) => setType(v as any)}
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="HOURLY" id="hourly" />
                    <label htmlFor="hourly">Stundenlohn</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="MONTHLY" id="monthly" />
                    <label htmlFor="monthly">Monatsgehalt</label>
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

          {/* BONUS Feld */}
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

          {/* SPECIAL Felder */}
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
                    value={validFrom ?? ''}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="input-field flex-1"
                  />
                  <input
                    type="date"
                    value={validUntil ?? ''}
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
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : 'Speichern'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
