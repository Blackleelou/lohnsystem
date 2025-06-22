// src/pages/rules/new.tsx
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Currency, EffectKind, ReferenceType, Operator, FrequencyUnit } from '@prisma/client'

// 1. Zod-Schema mit User-friendly Validations
const ruleSchema = z.object({
  name:           z.string().min(1, 'Bitte gib einen Namen ein'),
  description:    z.string().optional(),
  currency:       z.nativeEnum(Currency),
  validFrom:      z.string().refine(s => !isNaN(Date.parse(s)), 'Ungültiges Datum'),
  validTo:        z.string().refine(s => !isNaN(Date.parse(s))).nullable().optional(),
  frequencyUnit:  z.nativeEnum(FrequencyUnit),
  effects:        z.array(z.object({
                     kind:      z.nativeEnum(EffectKind),
                     value:     z.number().min(0),
                     reference: z.nativeEnum(ReferenceType)
                   })).min(1, 'Mindestens einen Effekt hinzufügen'),
  conditions:     z.array(z.object({
                     attribute: z.string().min(1),
                     operator:  z.nativeEnum(Operator),
                     jsonValue: z.any()
                   })).min(1, 'Mindestens eine Bedingung hinzufügen'),
  targets:        z.array(z.object({
                     type:  z.string().min(1),
                     value: z.string().min(1)
                   })).min(1, 'Mindestens ein Ziel hinzufügen')
})
type RuleForm = z.infer<typeof ruleSchema>

export default function NewRulePage() {
  const { control, register, handleSubmit, formState: { errors } } = useForm<RuleForm>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      currency: Currency.EUR,
      frequencyUnit: FrequencyUnit.NONE,
      effects: [{ kind: EffectKind.RATE, value: 0, reference: ReferenceType.ACTUAL_HOURS }],
      conditions: [{ attribute: 'month', operator: Operator.IN, jsonValue: [new Date().getMonth()+1] }],
      targets: [{ type: 'ROLE', value: 'MITARBEITER' }]
    }
  })

  const effects    = useFieldArray({ control, name: 'effects' })
  const conditions = useFieldArray({ control, name: 'conditions' })
  const targets    = useFieldArray({ control, name: 'targets' })

  const onSubmit = async (data: RuleForm) => {
    const resp = await fetch('/api/rules', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        title: data.name,
        description: data.description,
        currency: data.currency,
        validFrom: data.validFrom,
        validTo: data.validTo,
        frequencyUnit: data.frequencyUnit,
        effects: data.effects,
        conditions: data.conditions,
        targets: data.targets
      })
    })
    if (!resp.ok) {
      alert('Konnte Regel nicht speichern.')
    } else {
      alert('Regel erfolgreich angelegt!')
      window.location.href = '/rules'
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Neue Lohnregel anlegen</h1>

      {/* ————— Grunddaten ————— */}
      <section className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Regelname</span>
          <input
            {...register('name')}
            placeholder="z.B. Juni & Nov Vertretungs-Zuschlag"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
        </label>
        <label className="block">
          <span className="text-sm font-medium">Beschreibung (optional)</span>
          <textarea
            {...register('description')}
            placeholder="z.B. 2 €/h extra, wenn Vertretung im Juni oder November arbeitet"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Währung</span>
            <select
              {...register('currency')}
              className="mt-1 block w-full border-gray-300 rounded-md"
            >
              <option value="EUR">Euro (€)</option>
              <option value="USD">US-Dollar ($)</option>
              <option value="GBP">Brit. Pfund (£)</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Wie oft?</span>
            <select
              {...register('frequencyUnit')}
              className="mt-1 block w-full border-gray-300 rounded-md"
            >
              <option value="NONE">Ohne Limit</option>
              <option value="DAILY">Täglich</option>
              <option value="WEEKLY">Wöchentlich</option>
              <option value="MONTHLY">Monatlich</option>
              <option value="YEARLY">Jährlich</option>
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium">Gültig von</span>
            <input
              type="date"
              {...register('validFrom')}
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
            {errors.validFrom && <p className="text-red-600 text-xs mt-1">{errors.validFrom.message}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-medium">Gültig bis (optional)</span>
            <input
              type="date"
              {...register('validTo')}
              className="mt-1 block w-full border-gray-300 rounded-md"
            />
          </label>
        </div>
      </section>

      {/* ————— Effekte ————— */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Zuschläge & Boni</h2>
        {effects.fields.map((field, i) => (
          <div key={field.id} className="grid grid-cols-4 gap-3 items-end">
            <label className="block">
              <span className="text-sm">Art</span>
              <select
                {...register(`effects.${i}.kind` as const)}
                className="mt-1 block w-full border-gray-300 rounded-md"
              >
                <option value="RATE">Pro Stunde (€)</option>
                <option value="FIXED">Fixbetrag (€)</option>
                <option value="PERCENT">Prozent (%)</option>
              </select>
            </label>
            <label className="block col-span-1">
              <span className="text-sm">Wert</span>
              <input
                type="number"
                step="0.1"
                {...register(`effects.${i}.value` as const)}
                className="mt-1 block w-full border-gray-300 rounded-md"
              />
            </label>
            <label className="block">
              <span className="text-sm">Bezug</span>
              <select
                {...register(`effects.${i}.reference` as const)}
                className="mt-1 block w-full border-gray-300 rounded-md"
              >
                <option value="ACTUAL_HOURS">Gearbeitete Stunden</option>
                <option value="BASE_SALARY">Grundgehalt</option>
                <option value="OVERTIME_HOURS">Überstunden</option>
                <option value="SALES_VOLUME">Umsatz</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => effects.remove(i)}
              className="text-red-600 hover:underline text-sm"
            >
              Entfernen
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => effects.append({ kind: EffectKind.RATE, value: 0, reference: ReferenceType.ACTUAL_HOURS })}
          className="text-indigo-600 hover:underline text-sm"
        >
          + Zuschlag hinzufügen
        </button>
        {errors.effects && <p className="text-red-600 text-xs">{errors.effects.message}</p>}
      </section>

      {/* ————— Bedingungen ————— */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Wann soll die Regel greifen?</h2>
        {conditions.fields.map((field, i) => (
          <div key={field.id} className="grid grid-cols-4 gap-3 items-end">
            <label className="block">
              <span className="text-sm">Feld</span>
              <select
                {...register(`conditions.${i}.attribute` as const)}
                className="mt-1 block w-full border-gray-300 rounded-md"
              >
                <option value="month">Monat</option>
                <option value="weekday">Wochentag</option>
                <option value="shiftType">Schichttyp</option>
                <option value="weeklyHours">Wochenstunden</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm">Bedingung</span>
              <select
                {...register(`conditions.${i}.operator` as const)}
                className="mt-1 block w-full border-gray-300 rounded-md"
              >
                <option value="EQ">gleich</option>
                <option value="IN">in Liste</option>
                <option value="GT">größer als</option>
                <option value="LT">kleiner als</option>
              </select>
            </label>
            <label className="block col-span-2">
              <span className="text-sm">Wert</span>
              <Controller
                control={control}
                name={`conditions.${i}.jsonValue` as const}
                render={({ field }) => (
                  <input
                    className="mt-1 block w-full border-gray-300 rounded-md"
                    placeholder={typeof field.value === 'object' ? JSON.stringify(field.value) : String(field.value)}
                    value={JSON.stringify(field.value)}
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
            </label>
            <button
              type="button"
              onClick={() => conditions.remove(i)}
              className="text-red-600 hover:underline text-sm"
            >
              Entfernen
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => conditions.append({ attribute: '', operator: Operator.EQ, jsonValue: '' })}
          className="text-indigo-600 hover:underline text-sm"
        >
          + Bedingung hinzufügen
        </button>
        {errors.conditions && <p className="text-red-600 text-xs">{errors.conditions.message}</p>}
      </section>

      {/* ————— Zielgruppen ————— */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Wer soll das erhalten?</h2>
        {targets.fields.map((field, i) => (
          <div key={field.id} className="grid grid-cols-3 gap-3 items-end">
            <label className="block">
              <span className="text-sm">Art</span>
              <select
                {...register(`targets.${i}.type` as const)}
                className="mt-1 block w-full border-gray-300 rounded-md"
              >
                <option value="ROLE">Rolle</option>
                <option value="USER">Einzelner Mitarbeitender</option>
                <option value="DEPARTMENT">Abteilung</option>
              </select>
            </label>
            <label className="block col-span-2">
              <span className="text-sm">Wert</span>
              <input
                {...register(`targets.${i}.value` as const)}
                placeholder={field.type === 'ROLE' ? 'z.B. MITARBEITER' : ''}
                className="mt-1 block w-full border-gray-300 rounded-md"
              />
            </label>
            <button
              type="button"
              onClick={() => targets.remove(i)}
              className="text-red-600 hover:underline text-sm"
            >
              Entfernen
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => targets.append({ type: 'ROLE', value: '' })}
          className="text-indigo-600 hover:underline text-sm"
        >
          + Empfänger hinzufügen
        </button>
        {errors.targets && <p className="text-red-600 text-xs">{errors.targets.message}</p>}
      </section>

      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition"
        >
          Regel speichern
        </button>
      </div>
    </div>
  )
}
