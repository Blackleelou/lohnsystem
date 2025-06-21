import * as React from 'react'
import clsx from 'clsx'

interface SelectContextValue {
  value: string
  onValueChange: (v: string) => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

interface SelectRootProps {
  value: string
  onValueChange: (v: string) => void
  children: React.ReactNode
  className?: string
}

export const Select: React.FC<SelectRootProps> = ({ value, onValueChange, children, className }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className={clsx('relative', className)}>{children}</div>
    </SelectContext.Provider>
  )
}

/* ---------- Trigger ---------- */
interface TriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const SelectTrigger: React.FC<TriggerProps> = ({ className, children, ...props }) => {
  const ctx = React.useContext(SelectContext)!
  const display =
    children ?? (
      <span className="truncate">
        {ctx.value || <span className="text-gray-400">Bitte wählen…</span>}
      </span>
    )

  return (
    <button
      type="button"
      className={clsx('input-box w-full justify-between', className)}
      onClick={() => ctx.setOpen((o) => !o)}
      {...props}
    >
      {display}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 opacity-60"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

/* ---------- Content ---------- */
interface ContentProps {
  children: React.ReactNode
  className?: string
}
export const SelectContent: React.FC<ContentProps> = ({ children, className }) => {
  const ctx = React.useContext(SelectContext)!
  if (!ctx.open) return null
  return (
    <ul
      className={clsx(
        'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-lohn-cardLight dark:bg-lohn-cardDark p-1 shadow-lg',
        className
      )}
    >
      {children}
    </ul>
  )
}

/* ---------- Item ---------- */
interface ItemProps {
  value: string
  children: React.ReactNode
  className?: string
}
export const SelectItem: React.FC<ItemProps> = ({ value, children, className }) => {
  const ctx = React.useContext(SelectContext)!
  const active = ctx.value === value
  return (
    <li
      onClick={() => {
        ctx.onValueChange(value)
        ctx.setOpen(false)
      }}
      className={clsx(
        'cursor-pointer rounded-md px-3 py-2 text-sm',
        active ? 'bg-lohn-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700',
        className
      )}
    >
      {children}
    </li>
  )
}