// src/pages/rules/new.tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RuleKind, PayRuleType, Currency } from '@prisma/client'

import { RuleKindSelector } from '../../components/rules/RuleKindSelector'
import { CommonFields }     from '../../components/rules/CommonFields'
import { PayTypeSection }   from '../../components/rules/PayTypeSection'
import { ExtrasSection }    from '../../components/rules/ExtrasSection'

// Zod-Schema importieren oder hier definieren
const ruleSchema = z.object({ /* … wie zuvor … */ })
type RuleForm = z.infer<typeof ruleSchema>

export default function NewRulePage() {
  const { register, control, handleSubmit, watch, formState:{ errors } } = useForm<RuleForm>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      ruleKind: RuleKind.PAY,
      payType:  PayRuleType.MONTHLY,
      currency: Currency.EUR,
      validFrom: new Date().toISOString().slice(0,10)
    }
  })

  const ruleKind = watch('ruleKind')
  const payType  = watch('payType')

  const onSubmit = async (data: RuleForm) => {
    // … Payload bauen wie gehabt …
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Lohnregel konfigurieren</h1>

      {/* 1. RuleKind */}
      <RuleKindSelector value={ruleKind} onChange={v => control.setValue('ruleKind', v)} />

      {/* 2. Gemeinsame Felder */}
      <CommonFields register={register} errors={errors} />

      {/* 3. PAY-Sektion */}
      {ruleKind === RuleKind.PAY && (
        <PayTypeSection
          payType={payType}
          rate={watch('rate')}
          monthlyAmount={watch('monthlyAmount')}
          onChangeType={v => control.setValue('payType', v)}
          onChangeRate={v => control.setValue('rate', v)}
          onChangeMonthly={v => control.setValue('monthlyAmount', v)}
        />
      )}

      {/* 4. Extras (Bonus/Special oder PAY+Extras) */}
      <ExtrasSection control={control} register={register} />

      {/* 5. Submit */}
      <button onClick={handleSubmit(onSubmit)} className="w-full bg-indigo-600 text-white py-3 rounded">
        Regel speichern
      </button>
    </div>
  )
}
