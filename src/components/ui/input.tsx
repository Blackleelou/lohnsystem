import * as React from 'react'
import clsx from 'clsx'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx('input-field w-full', className)}
      {...props}
    />
  )
)
Input.displayName = 'Input'