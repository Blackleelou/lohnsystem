import * as React from 'react'
import { RadioGroup as HRadioGroup } from '@headlessui/react'
import clsx from 'clsx'

export const RadioGroup = HRadioGroup

interface RadioGroupItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ value, children, className }) => (
  <HRadioGroup.Option
    value={value}
    className={({ checked }) =>
      clsx(
        'inline-flex items-center gap-2 cursor-pointer',
        checked ? 'text-lohn-primary font-medium' : '',
        className
      )
    }
  >
    {({ checked }) => (
      <>
        <span
          className={clsx(
            'h-4 w-4 rounded-full border transition',
            checked ? 'bg-lohn-primary border-lohn-primary' : 'border-gray-400 bg-white'
          )}
        />
        {children}
      </>
    )}
  </HRadioGroup.Option>
)