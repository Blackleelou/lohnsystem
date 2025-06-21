import * as React from 'react'
import { Switch as HISwitch } from '@headlessui/react'
import clsx from 'clsx'

export interface SwitchProps {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  className?: string
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, className }) => (
  <HISwitch
    checked={checked}
    onChange={onCheckedChange}
    className={clsx(
      'relative inline-flex h-6 w-11 items-center rounded-full transition',
      checked ? 'bg-lohn-primary' : 'bg-gray-300',
      className
    )}
  >
    <span
      className={clsx(
        'inline-block h-4 w-4 transform rounded-full bg-white transition',
        checked ? 'translate-x-6' : 'translate-x-1'
      )}
    />
  </HISwitch>
)