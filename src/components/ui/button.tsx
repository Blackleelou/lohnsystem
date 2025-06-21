import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import clsx from 'clsx'

const buttonVariants = cva(
  'inline-flex items-center gap-2 justify-center rounded-lg px-4 py-2 transition font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-lohn-primary text-white hover:bg-lohn-primary-hover',
        secondary: 'bg-lohn-borderLight dark:bg-lohn-borderDark text-lohn-textLight dark:text-lohn-textDark hover:bg-lohn-borderLight/80 dark:hover:bg-lohn-borderDark/80',
        ghost: 'bg-transparent hover:bg-black/10 dark:hover:bg-white/10'
      },
      size: {
        default: '',
        sm: 'px-3 py-1.5 text-sm',
        lg: 'px-5 py-3 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = 'Button'