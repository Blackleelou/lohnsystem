// src/pages/rules/new.tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ruleSchema, RuleForm } from '../../schemas/ruleSchema'
import { RuleKind, PayRuleType } from '@prisma/client'

import { RuleKindSelector } from '../../components/rules/RuleKindSelector'
import { CommonFields }     from '../../components/rules/CommonFields'
import { PayTypeSection }   from '../../components/rules/PayTypeSection'
import { ExtrasSection }    from '../../components/rules/ExtrasSection'

export default function NewRulePage() {
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
      ruleKind:  RuleKind.PAY,
      payType:   PayRuleType.MONTHLY,
      currency:  undefined,              // Zod legt default EUR
      validFrom: new Date().toISOString().slice(0,10),
      effects:   [],
      conditions: [],
      targets:    []
    }
  })

  const ruleKind = watch('ruleKind')
  const payType  = watch('payType')

  const onSubmit = async (data: RuleForm) => {
    // 1) Grund-Payload
    const payload: any = {
      ruleKind:    data.ruleKind,
      title:       data.title,
      description: data.description || null,
      currency:    data.currency,
      validFrom:   data.validFrom,
      validTo:     data.validTo || null
    }

    // 2) PAY-spezifisch
    if (data.ruleKind === RuleKind.PAY) {
      payload.type = data.payType
      if (data.payType === PayRuleType.HOURLY) {
        payload.rate = data.rate
      } else {
        payload.fixedAmount = data.monthlyAmount
      }
    }

    // 3) Extras (Bonus/Special oder PAY mit Effekten)
    if (
      data.ruleKind !== RuleKind.PAY ||
      (data.ruleKind === RuleKind.PAY && data.effects && data.effects.length > 0)
    ) {
      if (data.frequencyUnit)                   payload.frequencyUnit = data.frequencyUnit
      if (data.effects && data.effects.length)   payload.effects    = { create: data.effects }
      if (data.conditions && data.conditions.length) payload.conditions = { create: data.conditions }
      if (data.targets && data.targets.length)     payload.targets    = { create: data.targets }
    }

    // 4) API-Call
    const res = await fetch('/api/rules', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })

    if (!res.ok) {
      alert('Konnte Regel nicht speichern.')
    } else {
      alert('Regel erfolgreich angelegt.')
      window.location.href = '/rules'
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Lohnregel konfigurieren</h1>

      {/* 1. RuleKind */}
      <RuleKindSelector
        value={ruleKind}
        onChange={v => setValue('ruleKind', v)}
      />

      {/* 2. Gemeinsame Felder */}
      <CommonFields register={register} errors={errors} />

      {/* 3. PAY-Sektion */}
      {ruleKind === RuleKind.PAY && (
        <PayTypeSection
          payType={payType}
          rate={watch('rate')}
          monthlyAmount={watch('monthlyAmount')}
          onChangeType={v => setValue('payType', v)}
          onChangeRate={v => setValue('rate', v)}
          onChangeMonthly={v => setValue('monthlyAmount', v)}
        />
      )}

      {/* 4. Extras */}
      <ExtrasSection control={control} register={register} />

      {/* 5. Absenden */}
      <button
        onClick={handleSubmit(onSubmit)}
        className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700"
      >
        Regel speichern
      </button>
    </div>
  )
}
