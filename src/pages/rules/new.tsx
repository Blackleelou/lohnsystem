// src/pages/rules/new.tsx

import { useForm, useFieldArray, Controller } from 'react-hook-form'         // Form-State-Management
import { zodResolver } from '@hookform/resolvers/zod'                         // Zod-Integration für Validierung
import { z } from 'zod'                                                       // Schema-Definition & Validierung
import {
  Currency,
  EffectKind,
  ReferenceType,
  Operator,
  FrequencyUnit
} from '@prisma/client'                                                       // Enums aus deinem Prisma-Schema

// ─────────────────────────────────────────────────────────────────────────────
// 1) Zod-Schema: Definiert Form-Shape & Validierung, plus sprechende Fehlermeldungen
// ─────────────────────────────────────────────────────────────────────────────
const ruleSchema = z.object({
  // Name/Titel der Regel
  name:        z.string().min(1, 'Bitte gib einen Namen ein'),
  // Freitext-Beschreibung (optional)
  description: z.string().optional(),
  // Währungsauswahl
  currency:    z.nativeEnum(Currency),
  // Gültigkeitsbeginn-Datum (als ISO-String)
  validFrom:   z.string().refine(s => !isNaN(Date.parse(s)), 'Ungültiges Datum'),
  // Gültigkeitsende (optional)
  validTo:     z.string().refine(s => !isNaN(Date.parse(s))).nullable().optional(),
  // Wie oft darf die Regel angewendet werden?
  frequencyUnit: z.nativeEnum(FrequencyUnit),

  // ── Dynamische Arrays ───────────────────────────────────────────────────
  // Effekte (Zuschläge/Boni)
  effects: z.array(
    z.object({
      kind:      z.nativeEnum(EffectKind),    // Typ: RATE | FIXED | PERCENT
      value:     z.number().min(0),           // numerischer Wert (z.B. € oder %)
      reference: z.nativeEnum(ReferenceType)  // Bezugsgröße (Stunden, Gehalt, etc.)
    })
  ).min(1, 'Mindestens einen Effekt hinzufügen'),

  // Bedingungen (wann greift die Regel?)
  conditions: z.array(
    z.object({
      attribute: z.string().min(1),          // Attribut, z.B. "month" oder "shiftType"
      operator:  z.nativeEnum(Operator),     // Vergleichsoperator
      jsonValue: z.any()                     // Wert oder Array/Werte-Objekt
    })
  ).min(1, 'Mindestens eine Bedingung hinzufügen'),

  // Zielgruppen (wer soll die Regel erhalten?)
  targets: z.array(
    z.object({
      type:  z.string().min(1),             // Rolle, User oder Abteilung
      value: z.string().min(1)              // z.B. "MITARBEITER" oder spezifische ID
    })
  ).min(1, 'Mindestens ein Ziel hinzufügen')
})
type RuleForm = z.infer<typeof ruleSchema>  // TypeScript-Typ aus dem Schema

// ─────────────────────────────────────────────────────────────────────────────
// 2) React-Komponente: NewRulePage
// ─────────────────────────────────────────────────────────────────────────────
export default function NewRulePage() {
  // useForm: initialisiert Formular mit Validierung via Zod
  const { control, register, handleSubmit, formState: { errors } } = useForm<RuleForm>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      currency:       Currency.EUR,
      frequencyUnit:  FrequencyUnit.NONE,
      // Standard-Effekt: 0€/h auf gearbeitete Stunden
      effects:    [{ kind: EffectKind.RATE, value: 0, reference: ReferenceType.ACTUAL_HOURS }],
      // Standard-Bedingung: aktueller Monat
      conditions: [{ attribute: 'month', operator: Operator.IN, jsonValue: [new Date().getMonth()+1] }],
      // Standard-Ziel: Rolle "MITARBEITER"
      targets:    [{ type: 'ROLE', value: 'MITARBEITER' }]
    }
  })

  // useFieldArray: Hooks, um dynamisch Felder hinzuzufügen/entfernen
  const effects    = useFieldArray({ control, name: 'effects' })
  const conditions = useFieldArray({ control, name: 'conditions' })
  const targets    = useFieldArray({ control, name: 'targets' })

  // onSubmit: wird aufgerufen, wenn das Formular validiert ist
  const onSubmit = async (data: RuleForm) => {
    // Passe den Payload an dein API-Schema an (title statt name)
    const payload = {
      title:         data.name,
      description:   data.description,
      currency:      data.currency,
      validFrom:     data.validFrom,
      validTo:       data.validTo || null,
      frequencyUnit: data.frequencyUnit,
      effects:       data.effects,
      conditions:    data.conditions,
      targets:       data.targets
    }

    // Call der Backend-API
    const resp = await fetch('/api/rules', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })

    if (!resp.ok) {
      alert('Konnte Regel nicht speichern.')
    } else {
      alert('Regel erfolgreich angelegt!')
      // Redirect zur Übersicht
      window.location.href = '/rules'
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Seiten-Titel */}
      <h1 className="text-2xl font-semibold">Neue Lohnregel anlegen</h1>

      {/* Grunddaten-Sektion */}
      <section className="space-y-4">
        {/* Regelname */}
        <label className="block">
          <span className="font-medium">Regelname</span>
          <input
            {...register('name')}
            placeholder="z.B. Juni & Nov Vertretungs-Zuschlag"
            className="mt-1 w-full border rounded-md p-2 focus:ring-indigo-500"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </label>

        {/* Beschreibung */}
        <label className="block">
          <span className="font-medium">Beschreibung (optional)</span>
          <textarea
            {...register('description')}
            placeholder="z.B. 2 €/h extra bei Vertretung im Juni oder November"
            className="mt-1 w-full border rounded-md p-2 focus:ring-indigo-500"
          />
        </label>

        {/* Währung & Frequenz */}
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="font-medium">Währung</span>
            <select {...register('currency')} className="mt-1 w-full border rounded-md p-2">
              <option value="EUR">Euro (€)</option>
              <option value="USD">US-Dollar ($)</option>
              <option value="GBP">Brit. Pfund (£)</option>
            </select>
          </label>
          <label className="block">
            <span className="font-medium">Wie oft?</span>
            <select {...register('frequencyUnit')} className="mt-1 w-full border rounded-md p-2">
              <option value="NONE">Ohne Limit</option>
              <option value="DAILY">Täglich</option>
              <option value="WEEKLY">Wöchentlich</option>
              <option value="MONTHLY">Monatlich</option>
              <option value="YEARLY">Jährlich</option>
            </select>
          </label>
        </div>

        {/* Gültigkeitszeitraum */}
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="font-medium">Gültig von</span>
            <input
              type="date"
              {...register('validFrom')}
              className="mt-1 w-full border rounded-md p-2"
            />
            {errors.validFrom && <p className="text-red-600 text-sm">{errors.validFrom.message}</p>}
          </label>
          <label className="block">
            <span className="font-medium">Gültig bis (optional)</span>
            <input
              type="date"
              {...register('validTo')}
              className="mt-1 w-full border rounded-md p-2"
            />
          </label>
        </div>
      </section>

      {/* Effekte-Sektion */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Zuschläge & Boni</h2>
        {effects.fields.map((field, i) => (
          <div key={field.id} className="grid grid-cols-4 gap-3 items-end">
            {/* Effekt-Art */}
            <label className="block">
              <span className="text-sm">Art</span>
              <select
                {...register(`effects.${i}.kind` as const)}
                className="mt-1 w-full border rounded-md p-2"
              >
                <option value="RATE">Pro Stunde (€)</option>
                <option value="FIXED">Fixbetrag (€)</option>
                <option value="PERCENT">Prozent (%)</option>
              </select>
            </label>
            {/* Wert */}
            <label className="block">
              <span className="text-sm">Wert</span>
              <input
                type="number"
                step="0.1"
                {...register(`effects.${i}.value` as const)}
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
            {/* Bezugsgröße */}
            <label className="block">
              <span className="text-sm">Bezug</span>
              <select
                {...register(`effects.${i}.reference` as const)}
                className="mt-1 w-full border rounded-md p-2"
              >
                <option value="ACTUAL_HOURS">Gearbeitete Stunden</option>
                <option value="BASE_SALARY">Grundgehalt</option>
                <option value="OVERTIME_HOURS">Überstunden</option>
                <option value="SALES_VOLUME">Umsatz</option>
              </select>
            </label>
            {/* Entfernen-Button */}
            <button
              type="button"
              onClick={() => effects.remove(i)}
              className="text-red-600 text-sm"
            >
              Entfernen
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => effects.append({ kind: EffectKind.RATE, value: 0, reference: ReferenceType.ACTUAL_HOURS })}
          className="text-indigo-600 text-sm"
        >
          + Zuschlag hinzufügen
        </button>
        {errors.effects && <p className="text-red-600 text-sm">{errors.effects.message}</p>}
      </section>

      {/* Bedingungen-Sektion */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Wann soll die Regel greifen?</h2>
        {conditions.fields.map((field, i) => (
          <div key={field.id} className="grid grid-cols-4 gap-3 items-end">
            {/* Attribut-Auswahl */}
            <label className="block">
              <span className="text-sm">Feld</span>
              <select
                {...register(`conditions.${i}.attribute` as const)}
                className="mt-1 w-full border rounded-md p-2"
              >
                <option value="month">Monat</option>
                <option value="weekday">Wochentag</option>
                <option value="shiftType">Schichttyp</option>
                <option value="weeklyHours">Wochenstunden</option>
              </select>
            </label>
            {/* Operator */}
            <label className="block">
              <span className="text-sm">Bedingung</span>
              <select
                {...register(`conditions.${i}.operator` as const)}
                className="mt-1 w-full border rounded-md p-2"
              >
                <option value="EQ">gleich</option>
                <option value="IN">in Liste</option>
                <option value="GT">größer als</option>
                <option value="LT">kleiner als</option>
              </select>
            </label>
            {/* Wert-Eingabe als JSON */}
            <label className="block col-span-2">
              <span className="text-sm">Wert</span>
              <Controller
                control={control}
                name={`conditions.${i}.jsonValue` as const}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder={JSON.stringify(field.value)}
                    className="mt-1 w-full border rounded-md p-2"
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
            {/* Entfernen */}
            <button
              type="button"
              onClick={() => conditions.remove(i)}
              className="text-red-600 text-sm"
            >
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
        {errors.conditions && <p className="text-red-600 text-sm">{errors.conditions.message}</p>}
      </section>

      {/* Zielgruppen-Sektion */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Wer soll das erhalten?</h2>
        {targets.fields.map((field, i) => (
          <div key={field.id} className="grid grid-cols-3 gap-3 items-end">
            {/* Typ-Auswahl */}
            <label className="block">
              <span className="text-sm">Art</span>
              <select
                {...register(`targets.${i}.type` as const)}
                className="mt-1 w-full border rounded-md p-2"
              >
                <option value="ROLE">Rolle</option>
                <option value="USER">Mitarbeiter</option>
                <option value="DEPARTMENT">Abteilung</option>
              </select>
            </label>
            {/* Wert */}
            <label className="block col-span-2">
              <span className="text-sm">Wert</span>
              <input
                {...register(`targets.${i}.value` as const)}
                placeholder="z.B. MITARBEITER oder Benutzer-ID"
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
            {/* Entfernen */}
            <button
              type="button"
              onClick={() => targets.remove(i)}
              className="text-red-600 text-sm"
            >
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
        {errors.targets && <p className="text-red-600 text-sm">{errors.targets.message}</p>}
      </section>

      {/* Absenden-Button */}
      <div className="mt-8 border-t pt-4">
        <button
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
        >
          Regel speichern
        </button>
      </div>
    </div>
  )
}
