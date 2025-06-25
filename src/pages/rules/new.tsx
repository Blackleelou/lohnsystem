// src/pages/rules/new.tsx

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ruleSchema, RuleForm } from '@/schemas/ruleSchema'
import { RuleKind, PayRuleType } from '@prisma/client'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { RuleKindSelector } from '@/components/rules/RuleKindSelector'
import { CommonFields } from '@/components/rules/CommonFields'
import { PayTypeSection } from '@/components/rules/PayTypeSection'
import { ExtrasSection } from '@/components/rules/ExtrasSection'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import FormField from '@/components/ui/FormField'

export default function NewPayrulePage() {
  const router = useRouter()
  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RuleForm>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      ruleKind: RuleKind.PAY,
      payType: PayRuleType.MONTHLY,
      currency: undefined,
      validFrom: new Date().toISOString().slice(0, 10),
      effects: [],
      conditions: [],
      targets: []
    }
  })

  const ruleKind = watch('ruleKind')
  const payType = watch('payType')

  const [groupMode, setGroupMode] = useState<'select' | 'custom'>('select')
  const [groupValue, setGroupValue] = useState('')
  const existingGroups = ['Tarif A', 'Tarif B', 'Sonderregelung']

  const onSubmit = async (data: RuleForm) => {
    const payload: any = {
      ruleKind: data.ruleKind,
      title: data.title,
      description: data.description || null,
      currency: data.currency,
      validFrom: data.validFrom,
      validTo: data.validTo || null,
      group: groupValue?.trim() || null
    }

    if (data.ruleKind === 'PAY') {
      payload.type = data.payType
      if (data.payType === 'HOURLY') {
        payload.rate = data.rate
      } else {
        payload.fixedAmount = data.monthlyAmount
      }
    }

    if (
      data.ruleKind !== 'PAY' ||
      (data.ruleKind === 'PAY' && data.effects && data.effects.length > 0)
    ) {
      if (data.frequencyUnit) payload.frequencyUnit = data.frequencyUnit
      if (data.effects && data.effects.length) payload.effects = { create: data.effects }
      if (data.conditions && data.conditions.length) payload.conditions = { create: data.conditions }
      if (data.targets && data.targets.length) payload.targets = { create: data.targets }
    }

    try {
      const res = await fetch('/api/team/payrules/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error()
      toast.success('Regel erfolgreich erstellt')
      router.push('/rules')
    } catch {
      toast.error('Erstellen fehlgeschlagen')
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-8 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold">Neue Lohneinstellung</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <RuleKindSelector value={ruleKind} onChange={(v) => setValue('ruleKind', v)} />

        <FormField label="Gruppe (optional)">
          {groupMode === 'select' ? (
            <div className="space-y-2">
              <Select value={groupValue} onValueChange={(v) => {
                if (v === '__new__') {
                  setGroupMode('custom')
                  setGroupValue('')
                } else {
                  setGroupValue(v)
                }
              }}>
                <SelectTrigger className="input-field" />
                <SelectContent>
                  {existingGroups.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                  <SelectItem value="__new__">+ Neue Gruppe anlegen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <input
              type="text"
              value={groupValue}
              onChange={(e) => setGroupValue(e.target.value)}
              placeholder="Neue Gruppe eingeben"
              className="input-field"
            />
          )}
        </FormField>

        <CommonFields register={register} errors={errors} />

        {ruleKind === 'PAY' && payType && (
          <PayTypeSection
            payType={payType}
            rate={watch('rate')}
            monthlyAmount={watch('monthlyAmount')}
            onChangeType={(v) => setValue('payType', v)}
            onChangeRate={(v) => setValue('rate', v)}
            onChangeMonthly={(v) => setValue('monthlyAmount', v)}
          />
        )}

        <ExtrasSection control={control} register={register} />

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            <Loader2 className="w-4 h-4 animate-spin hidden" />
            Speichern
          </button>
        </div>
      </form>
    </main>
  )
}
