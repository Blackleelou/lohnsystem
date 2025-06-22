// src/components/rules/ExtrasSection.tsx
import { FC } from 'react'
import { useFieldArray, Controller } from 'react-hook-form'
import { FrequencyUnit, EffectKind, ReferenceType, Operator } from '@prisma/client'

interface Props {
  control: any
  register: any
}

export const ExtrasSection: FC<Props> = ({ control, register }) => {
  const effects    = useFieldArray({ control, name: 'effects' })
  const conditions = useFieldArray({ control, name: 'conditions' })
  const targets    = useFieldArray({ control, name: 'targets' })

  return (
    <section className="pt-4 border-t space-y-4">
      <h2 className="font-medium mb-2">Extras & Bedingungen</h2>

      {/* Häufigkeit */}
      <label className="block mb-2">
        <span className="font-medium">Max. Anwendungen</span>
        <select {...register('frequencyUnit')} className="mt-1 w-full border rounded p-2">
          {Object.values(FrequencyUnit).map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </label>

      {/* Effekte */}
      {effects.fields.map((f, i) => (
        <div key={f.id} className="grid grid-cols-4 gap-2 items-end mb-2">
          <select {...register(`effects.${i}.kind`)} className="border rounded p-1">
            {Object.values(EffectKind).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <input type="number" {...register(`effects.${i}.value`)} className="border rounded p-1" />
          <select {...register(`effects.${i}.reference`)} className="border rounded p-1">
            {Object.values(ReferenceType).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button type="button" onClick={() => effects.remove(i)} className="text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => effects.append({ kind: EffectKind.FIXED, value: 0, reference: ReferenceType.BASE_SALARY })} className="text-indigo-600 text-sm">
        + Effekt
      </button>

      {/* Bedingungen */}
      {conditions.fields.map((f,i) => (
        <div key={f.id} className="grid grid-cols-4 gap-2 items-end mb-2">
          <input {...register(`conditions.${i}.attribute`)} placeholder="Attribut" className="border rounded p-1"/>
          <select {...register(`conditions.${i}.operator`)} className="border rounded p-1">
            {Object.values(Operator).map(o => <option key={o} value={o}>{o}</option>)}
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
                  try { field.onChange(JSON.parse(e.target.value)) }
                  catch { field.onChange(e.target.value) }
                }}
              />
            )}
          />
          <button type="button" onClick={() => conditions.remove(i)} className="text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => conditions.append({ attribute:'', operator:Operator.EQ, jsonValue:'' })} className="text-indigo-600 text-sm">
        + Bedingung
      </button>

      {/* Ziele */}
      {targets.fields.map((f,i) => (
        <div key={f.id} className="grid grid-cols-3 gap-2 items-end mb-2">
          <input {...register(`targets.${i}.type`)} placeholder="Typ" className="border rounded p-1"/>
          <input {...register(`targets.${i}.value`)} placeholder="Wert" className="border rounded p-1"/>
          <button type="button" onClick={() => targets.remove(i)} className="text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => targets.append({ type:'ROLE', value:'' })} className="text-indigo-600 text-sm">
        + Ziel
      </button>
    </section>
  )
}
