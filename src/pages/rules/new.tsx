// src/pages/rules/new.tsx

import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  RuleKind,
  PayRuleType,
  EffectKind,
  ReferenceType,
  FrequencyUnit,
  Operator,
  Currency
} from '@prisma/client'

// ─────────────────────────────────────────────────────────────────────────────
// 1) Zod-Schema: Validiert alle Eingaben, je nach ausgewähltem ruleKind
// ─────────────────────────────────────────────────────────────────────────────
const ruleSchema = z.object({
  // Grundsätzlich ein Pflichtfeld: entscheidet, was der User anlegt
  ruleKind:    z.nativeEnum(RuleKind),
  // Nur bei PAY (klassische Lohngruppe oder Stundenlohn)
  payType:     z.nativeEnum(PayRuleType).optional(),
  rate:        z.number().min(0).optional(),
  monthlyAmount: z.number().min(0).optional(),
  // Für alle Regeln: Name/Titel
  title:       z.string().min(1, 'Bitte gib einen Namen ein'),
  description: z.string().optional(),
  currency:    z.nativeEnum(Currency).default(Currency.EUR),
  // Wann gilt die Regel?
  validFrom:   z.string().refine(s => !isNaN(Date.parse(s)), 'Ungültiges Datum'),
  validTo:     z.string().refine(s => !s || !isNaN(Date.parse(s))).optional().nullable(),
  // Effekte & Bedingungen nur für komplexe Regeln
  frequencyUnit: z.nativeEnum(FrequencyUnit).optional(),
  effects:     z.array(z.object({
                  kind:      z.nativeEnum(EffectKind),
                  value:     z.number().min(0),
                  reference: z.nativeEnum(ReferenceType)
                })).optional(),
  conditions:  z.array(z.object({
                  attribute: z.string().min(1),
                  operator:  z.nativeEnum(Operator),
                  jsonValue: z.any()
                })).optional(),
  targets:     z.array(z.object({
                  type:  z.string().min(1),
                  value: z.string().min(1)
                })).optional(),
})
type RuleForm = z.infer<typeof ruleSchema>

export default function NewRulePage() {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<RuleForm>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      ruleKind: RuleKind.PAY,
      payType: PayRuleType.MONTHLY,
      currency: Currency.EUR,
      validFrom: new Date().toISOString().slice(0,10),
      effects:   [],
      conditions: [],
      targets:    []
    }
  })

  // Für Effekte/Conditions/Targets – werden nur bei Bedarf gerendert
  const effectsArr    = useFieldArray({ control, name: 'effects'   })
  const conditionsArr = useFieldArray({ control, name: 'conditions'})
  const targetsArr    = useFieldArray({ control, name: 'targets'   })

  // Um zwischen den Modi zu wechseln
  const ruleKind = watch('ruleKind')
  const payType  = watch('payType')

  // beim Submit wandeln wir in dein API-Payload um
  const onSubmit = async (data: RuleForm) => {
    // Grunddaten
    const payload: any = {
      ruleKind: data.ruleKind,
      title:    data.title,
      description: data.description,
      currency: data.currency,
      validFrom: data.validFrom,
      validTo:   data.validTo || null
    }

    // wenn PAY, füge payType + Werte hinzu
    if (data.ruleKind === RuleKind.PAY) {
      payload.type = data.payType
      if (data.payType === PayRuleType.HOURLY) {
        payload.rate = data.rate
      } else {
        payload.fixedAmount = data.monthlyAmount
      }
    }

    // bei BONUS/SPECIAL oder auch PAY mit extras: Effekte und Bedingungen
    if (data.ruleKind !== RuleKind.PAY || (data.ruleKind===RuleKind.PAY && data.effects?.length)) {
      if (data.frequencyUnit)    payload.frequencyUnit = data.frequencyUnit
      if (data.effects)           payload.effects    = { create: data.effects }
      if (data.conditions)        payload.conditions = { create: data.conditions }
      if (data.targets)           payload.targets    = { create: data.targets }
    }

    // API-Call
    const res = await fetch('/api/rules', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) return alert('Fehler beim Speichern')
    alert('Regel gespeichert!')
    window.location.href = '/rules'
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Lohnregel konfigurieren</h1>

      {/* ─── Auswahl RuleKind ────────────────────────────────────────────────── */}
      <div className="flex gap-4">
        {Object.values(RuleKind).map(kind => (
          <label key={kind} className="flex-1">
            <input
              type="radio"
              value={kind}
              {...register('ruleKind')}
              className="mr-2"
            />
            {kind === RuleKind.PAY ? 'Standard-Lohn' :
             kind === RuleKind.BONUS ? 'Zuschlag/Boni' :
             'Sonderzahlung'}
          </label>
        ))}
      </div>

      {/* ─── Common Fields ───────────────────────────────────────────────────── */}
      <label className="block">
        <span className="font-medium">Name der Regel</span>
        <input {...register('title')} className="mt-1 w-full border rounded p-2"/>
        {errors.title && <p className="text-red-600">{errors.title.message}</p>}
      </label>
      <label className="block">
        <span className="font-medium">Beschreibung (optional)</span>
        <textarea {...register('description')} className="mt-1 w-full border rounded p-2"/>
      </label>
      <div className="grid grid-cols-3 gap-4">
        <label>
          <span className="font-medium">Währung</span>
          <select {...register('currency')} className="mt-1 w-full border rounded p-2">
            {Object.values(Currency).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="font-medium">Gültig von</span>
          <input type="date" {...register('validFrom')} className="mt-1 w-full border rounded p-2"/>
        </label>
        <label>
          <span className="font-medium">Gültig bis (optional)</span>
          <input type="date" {...register('validTo')} className="mt-1 w-full border rounded p-2"/>
        </label>
      </div>

      {/* ─── PAY: Lohngruppen vs Stundenlohn ────────────────────────────────── */}
      {ruleKind === RuleKind.PAY && (
        <div className="space-y-4">
          <label className="font-medium">Art der Zahlung</label>
          <div className="flex gap-4">
            {Object.values(PayRuleType).map(pt => (
              <label key={pt} className="flex-1">
                <input type="radio" value={pt} {...register('payType')} className="mr-2"/>
                {pt === PayRuleType.MONTHLY ? 'Monatsgehalt' : 'Stundenlohn'}
              </label>
            ))}
          </div>

          {payType === PayRuleType.MONTHLY ? (
            // Monatsgehalt
            <label>
              <span className="font-medium">Monatsbetrag (€)</span>
              <input type="number" step="0.01" {...register('monthlyAmount')} className="mt-1 w-full border rounded p-2"/>
            </label>
          ) : (
            // Stundenlohn
            <label>
              <span className="font-medium">€ pro Stunde</span>
              <input type="number" step="0.01" {...register('rate')} className="mt-1 w-full border rounded p-2"/>
            </label>
          )}
        </div>
      )}

      {/* ─── BONUS oder SPECIAL (und auch PAY+Extras) ───────────────────────── */}
      {(ruleKind !== RuleKind.PAY) || (ruleKind===RuleKind.PAY) && effectsArr.fields.length > 0 ? (
        <>
          <section className="space-y-2 pt-4 border-t">
            <h2 className="font-medium">Extras & Bedingungen</h2>
            {/* Frequency */}
            <label>
              <span className="font-medium">Max. Anwendungen</span>
              <select {...register('frequencyUnit')} className="mt-1 w-full border rounded p-2">
                {Object.values(FrequencyUnit).map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </label>

            {/* Effekte */}
            {effectsArr.fields.map((f, i) =>
              <div key={f.id} className="grid grid-cols-4 gap-2 items-end">
                <select {...register(`effects.${i}.kind` as const)} className="border rounded p-1">
                  {Object.values(EffectKind).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
                <input type="number" step="0.01" {...register(`effects.${i}.value` as const)} className="border rounded p-1"/>
                <select {...register(`effects.${i}.reference` as const)} className="border rounded p-1">
                  {Object.values(ReferenceType).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button type="button" onClick={() => effectsArr.remove(i)} className="text-red-600">
                  Entfernen
                </button>
              </div>
            )}
            <button type="button" onClick={() => effectsArr.append({ kind: EffectKind.FIXED, value: 0, reference: ReferenceType.BASE_SALARY })} className="text-indigo-600 text-sm">
              + Effekt hinzufügen
            </button>

            {/* Bedingungen */}
            {conditionsArr.fields.map((f,i) =>
              <div key={f.id} className="grid grid-cols-4 gap-2 items-end">
                <input {...register(`conditions.${i}.attribute`)} placeholder="z.B. month" className="border rounded p-1"/>
                <select {...register(`conditions.${i}.operator` as const)} className="border rounded p-1">
                  {Object.values(Operator).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <Controller
                  control={control}
                  name={`conditions.${i}.jsonValue` as const}
                  render={({ field }) => (
                    <input
                      value={JSON.stringify(field.value)}
                      onChange={e => {
                        try { field.onChange(JSON.parse(e.target.value)) }
                        catch { field.onChange(e.target.value) }
                      }}
                      placeholder='z.B. [6,11]'
                      className="border rounded p-1"
                    />
                  )}
                />
                <button type="button" onClick={() => conditionsArr.remove(i)} className="text-red-600">
                  Entfernen
                </button>
              </div>
            )}
            <button type="button" onClick={() => conditionsArr.append({ attribute:'', operator:Operator.EQ, jsonValue:'' })} className="text-indigo-600 text-sm">
              + Bedingung hinzufügen
            </button>

            {/* Ziele */}
            {targetsArr.fields.map((f,i) =>
              <div key={f.id} className="grid grid-cols-3 gap-2 items-end">
                <input {...register(`targets.${i}.type`)} placeholder="ROLE,USER,..." className="border rounded p-1"/>
                <input {...register(`targets.${i}.value`)} placeholder="z.B. MITARBEITER" className="border rounded p-1"/>
                <button type="button" onClick={() => targetsArr.remove(i)} className="text-red-600">
                  Entfernen
                </button>
              </div>
            )}
            <button type="button" onClick={() => targetsArr.append({ type:'ROLE', value:'' })} className="text-indigo-600 text-sm">
              + Ziel hinzufügen
            </button>
          </section>
        </>
      ) : null}

      {/* Absenden */}
      <button
        onClick={handleSubmit(onSubmit)}
        className="mt-6 w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700"
      >
        Regel speichern
      </button>

      {/* Debug: Form-Errors */}
      {Object.keys(errors).length > 0 && (
        <pre className="mt-4 p-2 bg-red-50 text-red-700 text-sm">
          {JSON.stringify(errors, null, 2)}
        </pre>
      )}
    </div>
  )
}
