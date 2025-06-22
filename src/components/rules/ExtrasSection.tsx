// src/components/rules/ExtrasSection.tsx
import { FC } from 'react'
import { useFieldArray, Controller } from 'react-hook-form'
import {
  FrequencyUnit,
  EffectKind,
  ReferenceType,
  Operator
} from '@prisma/client'

interface Props {
  control: any
  register: any
}

// Deutsch-Beschriftungen für Enums
const frequencyLabels: Record<FrequencyUnit, string> = {
  NONE:    'Unbegrenzt',
  DAILY:   'Einmal pro Tag',
  WEEKLY:  'Einmal pro Woche',
  MONTHLY: 'Einmal pro Monat',
  YEARLY:  'Einmal pro Jahr'
}

const effectKindLabels: Record<EffectKind, string> = {
  FIXED:   'Fixer Betrag',
  PERCENT: 'Prozentualer Zuschlag',
  RATE:    'Satz pro Einheit'
}

const referenceLabels: Record<ReferenceType, string> = {
  BASE_SALARY:    'Grundgehalt',
  ACTUAL_HOURS:   'Gearbeitete Stunden',
  FIXED_AMOUNT:   'Fester Betrag',
  WEEKLY_HOURS:   'Wochenarbeitszeit',
  SALES_VOLUME:   'Umsatzvolumen',
  OVERTIME_HOURS: 'Überstunden',
  SHIFT_COUNT:    'Anzahl Schichten'
}

const operatorLabels: Record<Operator, string> = {
  EQ:      'Gleich (=)',
  NEQ:     'Ungleich (≠)',
  GT:      'Größer als (>)',
  GTE:     'Größer oder gleich (≥)',
  LT:      'Kleiner als (<)',
  LTE:     'Kleiner oder gleich (≤)',
  IN:      'In Liste',
  NOT_IN:  'Nicht in Liste',
  BETWEEN: 'Zwischen'
}

export const ExtrasSection: FC<Props> = ({ control, register }) => {
  const effects    = useFieldArray({ control, name: 'effects' })
  const conditions = useFieldArray({ control, name: 'conditions' })
  const targets    = useFieldArray({ control, name: 'targets' })

  return (
    <section className="pt-4 border-t space-y-6">
      <h2 className="font-medium mb-2">Extras &amp; Bedingungen</h2>

      {/* Gültigkeits-Intervall */}
      <label className="block mb-4">
        <span className="font-medium">Gültigkeits-Intervall</span>
        <select {...register('frequencyUnit')} className="mt-1 w-full border rounded p-2">
          {Object.values(FrequencyUnit).map(f => (
            <option key={f} value={f}>
              {frequencyLabels[f]}
            </option>
          ))}
        </select>
      </label>

      {/* Zuschläge / Boni */}
      <div>
        <span className="font-medium">Zuschläge / Boni</span>
        {effects.fields.map((f, i) => (
          <div key={f.id} className="grid grid-cols-4 gap-2 items-end my-2">
            <select {...register(`effects.${i}.kind`)} className="border rounded p-1">
              {Object.values(EffectKind).map(k => (
                <option key={k} value={k}>
                  {effectKindLabels[k]}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              {...register(`effects.${i}.value`)}
              placeholder="Wert"
              className="border rounded p-1"
            />
            <select {...register(`effects.${i}.reference`)} className="border rounded p-1">
              {Object.values(ReferenceType).map(r => (
                <option key={r} value={r}>
                  {referenceLabels[r]}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => effects.remove(i)} className="text-red-600">
              Entfernen
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            effects.append({ kind: EffectKind.FIXED, value: 0, reference: ReferenceType.BASE_SALARY })
          }
          className="text-indigo-600 text-sm"
        >
          + Zuschlag hinzufügen
        </button>
      </div>

      {/* Bedingungen */}
      <div>
        <span className="font-medium">Bedingungen (z.B. Monat, Schicht)</span>
        {conditions.fields.map((f, i) => (
          <div key={f.id} className="grid grid-cols-4 gap-2 items-end my-2">
            <input
              {...register(`conditions.${i}.attribute`)}
              placeholder="Feld (z.B. Monat)"
              className="border rounded p-1"
            />
            <select {...register(`conditions.${i}.operator`)} className="border rounded p-1">
              {Object.values(Operator).map(o => (
                <option key={o} value={o}>
                  {operatorLabels[o]}
                </option>
              ))}
            </select>
            <Controller
              control={control}
              name={`conditions.${i}.jsonValue`}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="Wert (z.B. [6,11])"
                  className="border rounded p-1"
                  onChange={e => {
                    try {
                      field.onChange(JSON.parse(e.target.value))
                    } catch {
                      field.onChange(e.target.value)
                    }
                  }}
                />
              )}
            />
            <button type="button" onClick={() => conditions.remove(i)} className="text-red-600">
              Entfernen
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => conditions.append({ attribute: '', operator: Operator.EQ, jsonValue: '' })}
          className="text-indigo-600 text-sm"
        >
          + Bedingung hinzufügen
        </button>
      </div>

      {/* Empfänger */}
      <div>
        <span className="font-medium">Wer profitiert?</span>
        {targets.fields.map((f, i) => (
          <div key={f.id} className="grid grid-cols-3 gap-2 items-end my-2">
            <input
              {...register(`targets.${i}.type`)}
              placeholder="Typ (z.B. Rolle)"
              className="border rounded p-1"
            />
            <input
              {...register(`targets.${i}.value`)}
              placeholder="Wert (z.B. MITARBEITER)"
              className="border rounded p-1"
            />
            <button type="button" onClick={() => targets.remove(i)} className="text-red-600">
              Entfernen
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => targets.append({ type: 'ROLE', value: '' })}
          className="text-indigo-600 text-sm"
        >
          + Empfänger hinzufügen
        </button>
      </div>
    </section>
  )
}
