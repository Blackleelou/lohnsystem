// src/components/rules/RuleKindSelector.tsx
import { FC } from 'react'
import { RuleKind } from '@prisma/client'

interface Props {
  value: RuleKind
  onChange: (v: RuleKind) => void
}

export const RuleKindSelector: FC<Props> = ({ value, onChange }) => (
  <div className="flex gap-4 mb-4">
    {Object.values(RuleKind).map(kind => (
      <label key={kind} className="flex-1">
        <input
          type="radio"
          name="ruleKind"
          value={kind}
          checked={value === kind}
          onChange={() => onChange(kind)}
          className="mr-2"
        />
        {{
          PAY:     'Standard-Lohn',
          BONUS:   'Zuschlag/Boni',
          SPECIAL: 'Sonderzahlung'
        }[kind]}
      </label>
    ))}
  </div>
)
