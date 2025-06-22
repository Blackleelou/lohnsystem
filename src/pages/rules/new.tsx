// pages/rules/new.tsx
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Currency, EffectKind, ReferenceType, Operator, FrequencyUnit } from '@prisma/client'

/** 1. Zod-Schema spiegelt API-Shape wider **/
const ruleSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  currency: z.nativeEnum(Currency),
  frequencyUnit: z.nativeEnum(FrequencyUnit),
  occurrenceLimit: z.number().int().optional(),
  priority: z.number().int().default(0),
  validFrom: z.string().refine(s => !isNaN(Date.parse(s))),
  validTo: z.string().refine(s => !isNaN(Date.parse(s))).nullable().optional(),

  effects: z.array(z.object({
    kind: z.nativeEnum(EffectKind),
    value: z.number().min(0),
    reference: z.nativeEnum(ReferenceType),
    note: z.string().optional()
  })).min(1, 'Mindestens ein Effekt'),

  conditions: z.array(z.object({
    attribute: z.string().min(1),
    operator: z.nativeEnum(Operator),
    jsonValue: z.any()
  })).min(1, 'Mindestens eine Bedingung'),

  targets: z.array(z.object({
    type: z.string().min(1),
    value: z.string().min(1)
  })).min(1, 'Mindestens ein Ziel')
})

type RuleForm = z.infer<typeof ruleSchema>

export default function NewRulePage() {
  const { control, register, handleSubmit, formState: { errors } } = useForm<RuleForm>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      effects: [{ kind: EffectKind.RATE, value: 0, reference: ReferenceType.ACTUAL_HOURS }],
      conditions: [{ attribute: 'month', operator: Operator.IN, jsonValue: [6] }],
      targets: [{ type: 'ROLE', value: '' }]
    }
  })

  // Arrays für dynamisches Hinzufügen/Entfernen
  const effects = useFieldArray({ control, name: 'effects' })
  const conditions = useFieldArray({ control, name: 'conditions' })
  const targets = useFieldArray({ control, name: 'targets' })

  const onSubmit = async (data: RuleForm) => {
    const res = await fetch('/api/rules/rules', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      alert('Fehler beim Speichern')
      return
    }
    const result = await res.json()
    console.log('angelegt:', result)
    // z.B. Redirect oder Notification
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
      <h1>Neue Regel anlegen</h1>

      {/* ─── Grunddaten ─────────────────────────────────────────── */}
      <div>
        <label>Titel</label>
        <input {...register('title')} />
        <p style={{ color:'red' }}>{errors.title?.message}</p>
      </div>
      <div>
        <label>Beschreibung</label>
        <textarea {...register('description')} />
      </div>
      <div>
        <label>Währung</label>
        <select {...register('currency')}>
          {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label>Gültig ab</label>
        <input type="date" {...register('validFrom')} />
        <p style={{ color:'red' }}>{errors.validFrom?.message}</p>
      </div>
      <div>
        <label>Gültig bis</label>
        <input type="date" {...register('validTo')} />
      </div>

      {/* ─── Effects ─────────────────────────────────────────── */}
      <h2>Effekte</h2>
      {effects.fields.map((field, i) => (
        <div key={field.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <label>Art</label>
          <select {...register(`effects.${i}.kind`)}>
            {Object.values(EffectKind).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <label>Wert</label>
          <input type="number" step="0.1" {...register(`effects.${i}.value` as const)} />
          <label>Bezugsgröße</label>
          <select {...register(`effects.${i}.reference`)}>
            {Object.values(ReferenceType).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button type="button" onClick={() => effects.remove(i)}>❌ Entfernen</button>
        </div>
      ))}
      <button type="button" onClick={() => effects.append({ kind: EffectKind.FIXED, value: 0, reference: ReferenceType.BASE_SALARY })}>
        + Effekt hinzufügen
      </button>

      {/* ─── Conditions ─────────────────────────────────────────── */}
      <h2>Bedingungen</h2>
      {conditions.fields.map((field, i) => (
        <div key={field.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <label>Attribut</label>
          <input {...register(`conditions.${i}.attribute` as const)} placeholder="z.B. month" />
          <label>Operator</label>
          <select {...register(`conditions.${i}.operator` as const)}>
            {Object.values(Operator).map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <label>Wert (JSON)</label>
          <Controller
            control={control}
            name={`conditions.${i}.jsonValue` as const}
            render={({ field }) => (
              <input
                value={JSON.stringify(field.value)}
                onChange={e => {
                  try {
                    field.onChange(JSON.parse(e.target.value))
                  } catch {
                    // ignore parse errors
                  }
                }}
              />
            )}
          />
          <button type="button" onClick={() => conditions.remove(i)}>❌ Entfernen</button>
        </div>
      ))}
      <button type="button" onClick={() => conditions.append({ attribute: '', operator: Operator.EQ, jsonValue: '' })}>
        + Bedingung hinzufügen
      </button>

      {/* ─── Targets ─────────────────────────────────────────── */}
      <h2>Zielgruppen</h2>
      {targets.fields.map((field, i) => (
        <div key={field.id}>
          <label>Typ</label>
          <input {...register(`targets.${i}.type` as const)} placeholder="USER/ROLE/DEPARTMENT" />
          <label>Wert</label>
          <input {...register(`targets.${i}.value` as const)} placeholder="z.B. MITARBEITER oder u123" />
          <button type="button" onClick={() => targets.remove(i)}>❌ Entfernen</button>
        </div>
      ))}
      <button type="button" onClick={() => targets.append({ type: '', value: '' })}>
        + Ziel hinzufügen
      </button>

      <hr style={{ margin: '20px 0' }} />

      <button type="submit" style={{ padding: '10px 20px', fontSize: 16 }}>Regel speichern</button>
    </form>
  )
}
