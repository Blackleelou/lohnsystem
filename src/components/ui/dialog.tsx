// src/components/ui/dialog.tsx
import * as React from 'react'
import { Dialog as HIDialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import clsx from 'clsx'

/* ---------- Root ---------- */
interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <Transition show={open} as={React.Fragment}>
      <HIDialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClose={onOpenChange}
      >
        {/* Overlay */}
        <Transition.Child
          as={React.Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* Panel */}
        <Transition.Child
          as={React.Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {children}
        </Transition.Child>
      </HIDialog>
    </Transition>
  )
}

/* ---------- Content ---------- */
interface ContentProps {
  children: React.ReactNode
  className?: string
}

export function DialogContent({ children, className }: ContentProps) {
  return (
    <div
      className={clsx(
        'w-full max-w-md rounded-2xl bg-lohn-cardLight dark:bg-lohn-cardDark p-8 shadow-lg',
        className
      )}
    >
      {/* Close btn */}
      <button
        onClick={() => {
          /* wird von Eltern-Komponente gesteuert */
        }}
        className="absolute top-4 right-4 rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>

      {children}
    </div>
  )
}

/* ---------- Header & Title ---------- */
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
