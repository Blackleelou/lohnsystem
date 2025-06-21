import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import toast from 'react-hot-toast'
import type { PayRule } from '@/types/PayRule'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import FormField from '@/components/ui/FormField'
import { Switch } from '@/components/ui/switch'

interface Props {
  onClose: () => void
  onCreate: (newRule: PayRule) => void
  prefillGroup?: string | null
  existingGroups: string[]
}

export default function CreatePayruleModal({ onClose, onCreate, prefillGroup, existingGroups }: Props) {
  const [title, setTitle] = useState('')
  const [rate, setRate] = useState('')
  const [type, setType] = useState<'HOURLY' | 'MONTHLY'>('HOURLY')
  const [ruleKind, setRuleKind] = useState<'PAY' | 'BONUS' | 'SPECIAL'>('PAY')
  const [percent, setPercent] = useState('')
  const [fixedAmount, setFixedAmount] = useState('')
  const [onlyDecember, setOnlyDecember] = useState(false)
  const [onlyForAdmins, setOnlyForAdmins] = useState(false)
  const [oncePerYear, setOncePerYear] = useState(false)
  const [referenceType, setReferenceType] = useState<'BASE_SALARY' | 'ACTUAL_HOURS' | 'FIXED_AMOUNT'>('FIXED_AMOUNT')
  const [validFrom, setValidFrom] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [saving, setSaving] = useState(false)
  const [group, setGroup] = useState(prefillGroup || '')

  const handleSave = async () => {
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
          onlyForAdmins: ruleKind === 'SPECIAL' ? onlyForAdmins : undefined,
          oncePerYear: ruleKind === 'SPECIAL' ? oncePerYear : undefined,
          referenceType: ruleKind === 'SPECIAL' ? referenceType : undefined,
          validFrom: ruleKind === 'SPECIAL' ? validFrom || null : undefined,
          validUntil: ruleKind === 'SPECIAL' ? validUntil || null : undefined,
        }),
      })

      if (!res.ok) throw new Error()
      const newRule = await res.json()
      onCreate(newRule)
      onClose()
    } catch {
      toast.error('Erstellen fehlgeschlagen')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="rounded-2xl p-8 space-y-8" onOpenChange={onClose}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Neue Lohneinstellung</DialogTitle>
        </DialogHeader>

        <div className="grid gap-5">
          <FormField label="Regeltyp">
            <RadioGroup value={ruleKind} onValueChange={(v) => setRuleKind(v as any)} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="PAY" id="pay" />
                <label htmlFor="pay">Grundlohn</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="BONUS" id="bonus" />
                <label htmlFor="bonus">Zuschlag</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="SPECIAL" id="special" />
                <label htmlFor="special">Sonderzahlung</label>
              </div>
            </RadioGroup>
          </FormField>

          <FormField label="Bezeichnung" htmlFor="title">
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field w-full"
            />
          </FormField>

          <FormField label="Gruppe (optional)" htmlFor="group">
            <input
              id="group"
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="input-field w-full"
            />
          </FormField>

          {/* PAY Felder */}
          {ruleKind === 'PAY' && (
            <>
              <FormField label="Typ">
                <RadioGroup value={type} onValueChange={(v) => setType(v as any)} className="flex gap-6">
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

              <FormField label="Optionen">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Nur im Dezember auszahlen</span>
                    <Switch checked={onlyDecember} onCheckedChange={setOnlyDecember} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nur für Admins sichtbar</span>
                    <Switch checked={onlyForAdmins} onCheckedChange={setOnlyForAdmins} />
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

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : 'Erstellen'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
