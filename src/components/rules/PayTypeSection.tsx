// src/components/rules/PayTypeSection.tsx
import { FC } from 'react'
import { PayRuleType } from '@prisma/client'

interface Props {
  payType: PayRuleType
  rate?: number
  monthlyAmount?: number
  onChangeType: (v: PayRuleType) => void
  onChangeRate: (v: number) => void
  onChangeMonthly: (v: number) => void
}

export const PayTypeSection: FC<Props> = ({
  payType, rate, monthlyAmount,
  onChangeType, onChangeRate, onChangeMonthly
}) => (
  <div className="space-y-4 mb-6">
    <label className="font-medium block mb-1">Art der Zahlung</label>
    <div className="flex gap-4 mb-2">
      {Object.values(PayRuleType).map(pt => (
        <label key={pt} className="flex-1">
          <input
            type="radio"
            name="payType"
            value={pt}
            checked={payType === pt}
            onChange={() => onChangeType(pt)}
            className="mr-2"
          />
          {pt === PayRuleType.MONTHLY ? 'Monatsgehalt' : 'Stundenlohn'}
        </label>
      ))}
    </div>
    {payType === PayRuleType.MONTHLY ? (
      <label className="block">
        <span className="font-medium">Monatsbetrag (€)</span>
        <input
          type="number"
          step="0.01"
          value={monthlyAmount}
          onChange={e => onChangeMonthly(+e.target.value)}
          className="mt-1 w-full border rounded p-2"
        />
      </label>
    ) : (
      <label className="block">
        <span className="font-medium">€ pro Stunde</span>
        <input
          type="number"
          step="0.01"
          value={rate}
          onChange={e => onChangeRate(+e.target.value)}
          className="mt-1 w-full border rounded p-2"
        />
      </label>
    )}
  </div>
)
