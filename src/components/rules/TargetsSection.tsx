// src/components/rules/TargetsSection.tsx
import { FC } from 'react'
import { useFieldArray } from 'react-hook-form'

interface Props {
  control: any
  register: any
}

export const TargetsSection: FC<Props> = ({ control, register }) => {
  const targets = useFieldArray({ control, name: 'targets' })

  return (
    <div>
      <h2 className="font-medium mb-2">Wer profitiert?</h2>
      {targets.fields.map((f, i) => (
        <div key={f.id} className="grid grid-cols-3 gap-2 items-end my-2">
          {/* Auswahl des Ziel-Typs */}
          <select {...register(`targets.${i}.type`)} className="border rounded p-1">
            <option value="ROLE">Mitarbeiter-Gruppe</option>
            <option value="USER">Einzelner Mitarbeiter</option>
            <option value="DEPARTMENT">Abteilung</option>
          </select>

          {/* Freitext für den konkreten Wert */}
          <input
            {...register(`targets.${i}.value`)}
            placeholder="z. B. ‚Mitarbeiter‘, E-Mail oder Abteilung"
            className="border rounded p-1"
          />

          {/* Entfernen-Button */}
          <button type="button" onClick={() => targets.remove(i)} className="text-red-600">
            Entfernen
          </button>
        </div>
      ))}

      {/* Neuen Empfänger hinzufügen */}
      <button
        type="button"
        onClick={() => targets.append({ type: 'ROLE', value: '' })}
        className="text-indigo-600 text-sm"
      >
        + Empfänger hinzufügen
      </button>
    </div>
  )
}
