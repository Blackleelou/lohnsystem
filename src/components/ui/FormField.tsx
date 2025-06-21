import { ReactNode } from 'react'

interface Props {
  label: string
  htmlFor?: string
  children: ReactNode
  error?: string
  className?: string
}

/** Einheitlicher Feld-Wrapper: Label, Body, Error */
export default function FormField({ label, htmlFor, children, error, className }: Props) {
  return (
    <div className={className ?? 'space-y-1'}>
      <label htmlFor={htmlFor} className="form-label">
        {label}
      </label>

      {children}

      {error && <p className="form-error">{error}</p>}
    </div>
  )
}