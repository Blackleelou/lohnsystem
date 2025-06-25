import * as React from 'react'
import { Dialog as HIDialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import clsx from 'clsx'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => (
  <Transition show={open} as={React.Fragment}>
    <HIDialog onClose={onOpenChange} className="relative z-50">
      <Transition.Child
        as={React.Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/40" />
      </Transition.Child>

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {/* Kein max-w-md mehr hier */}
          <HIDialog.Panel className="w-full flex justify-center">
            {children}
          </HIDialog.Panel>
        </Transition.Child>
      </div>
    </HIDialog>
  </Transition>
)

interface ContentProps {
  children: React.ReactNode
  className?: string
  onOpenChange: (open: boolean) => void
}

export const DialogContent = React.forwardRef<HTMLDivElement, ContentProps>(
  function DialogContent(props, ref) {
    const { children, className, onOpenChange } = props
    return (
      <div
        ref={ref}
        className={clsx(
          'relative bg-lohn-cardLight dark:bg-lohn-cardDark shadow-lg',
          className
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    )
  }
)

DialogContent.displayName = 'DialogContent'

interface HeaderProps {
  children: React.ReactNode
  className?: string
}
export const DialogHeader = ({ children, className }: HeaderProps) => (
  <div className={clsx('space-y-2', className)}>{children}</div>
)

interface TitleProps {
  children: React.ReactNode
  className?: string
}
export const DialogTitle = ({ children, className }: TitleProps) => (
  <h2 className={clsx('text-xl font-semibold', className)}>{children}</h2>
)
