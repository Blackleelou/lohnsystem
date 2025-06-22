// src/components/rules/CommonFields.tsx
import { FC } from 'react'
import { Currency } from '@prisma/client'

interface Props {
  register: any
  errors: any
}

export const CommonFields: FC<Props> = ({ register, errors }) => (
  <>
    <label className="block mb-4">
      <span className="font-medium">Regelname</span>
      <input {...register('title')} className="mt-1 w-full border rounded p-2" />
      {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
    </label>
    <label className="block mb-4">
      <span className="font-medium">Beschreibung (optional)</span>
      <textarea {...register('description')} className="mt-1 w-full border rounded p-2" />
    </label>
    <div className="grid grid-cols-3 gap-4 mb-6">
      <label>
        <span className="font-medium">Währung</span>
        <select {...register('currency')} className="mt-1 w-full border rounded p-2">
          {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label>
        <span className="font-medium">Gültig von</span>
        <input type="date" {...register('validFrom')} className="mt-1 w-full border rounded p-2" />
      </label>
      <label>
        <span className="font-medium">Gültig bis</span>
        <input type="date" {...register('validTo')} className="mt-1 w-full border rounded p-2" />
      </label>
    </div>
  </>
)
