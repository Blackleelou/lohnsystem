import * as React from 'react'
import { RadioGroup as HRadioGroup } from '@headlessui/react'
import clsx from 'clsx'

/* ---------- Root ---------- */
interface RadioGroupProps<T extends string = string> {
  /** aktueller Wert */
  value: T
  /** Callback – wir nennen ihn wie bei shadcn „onValueChange“ */
  onValueChange: (v: T) => void
  children: React.ReactNode
  className?: string
}

export function RadioGroup<T extends string = string>({
  value,
  onValueChange,
  children,
  className,
}: RadioGroupProps<T>) {
  return (
    <HRadioGroup value={value} onChange={onValueChange} className={className}>
      {children}
    </HRadioGroup>
  )
}

/* ---------- Item ---------- */
interface RadioGroupItemProps {
  value: string
  id?: string
  children: React.ReactNode
  className?: string
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  children,
  className,
}) => (
  <HRadioGroup.Option
    value={value}
    className={({ checked }) =>
      clsx(
        'inline-flex items-center gap-2 cursor-pointer',
        checked ? 'text-lohn-primary font-medium' : '',
        className,
      )
    }
  >
    {({ checked }) => (
      <>
        <span
          id={id}
          className={clsx(
            'h-4 w-4 rounded-full border transition',
            checked ? 'bg-lohn-primary border-lohn-primary' : 'border-gray-400 bg-white',
          )}
        />
        {children}
      </>
    )}
  </HRadioGroup.Option>
)
