import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { PayRule } from '@/types/PayRule'

interface Props {
  onClose: () => void
  onCreate: (newRule: PayRule) => void
  prefillGroup?: string | null
  existingGroups: string[]
}

export default function CreatePayruleModal({ onClose, onCreate, prefillGroup, existingGroups }: Props) {
  const [ruleKind, setRuleKind] = useState<'PAY' | 'BONUS' | 'SPECIAL'>('PAY')
  const [type, setType] = useState<'HOURLY' | 'MONTHLY'>('HOURLY')
  const [group, setGroup] = useState(prefillGroup || '')

  return (
    <Dialog open onOpenChange={onClose}>
  <DialogContent
    onOpenChange={onClose}
    className="w-[90vw] h-[90vh] max-w-none max-h-none p-0 overflow-hidden rounded-2xl shadow-xl bg-white"
  >
    {/* Header */}
    <div className="flex items-center justify-between border-b px-6 py-4">
      <DialogTitle className="text-2xl font-semibold text-gray-800">
        Neue Lohneinstellung
      </DialogTitle>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg">
        ✕
      </button>
    </div>

    {/* Split View: 25% / 75% */}
    <div className="flex h-[calc(90vh-64px)] w-full">
      {/* Linke Seite – Menü (max 25%) */}
      <aside className="w-full max-w-xs border-r bg-gray-50 p-6 space-y-8">
        {/* Regeltyp */}
        <div>
          <div className="text-sm font-semibold mb-2 text-gray-700">Regeltyp</div>
          <div className="flex flex-col gap-2">
            {['PAY', 'BONUS', 'SPECIAL'].map((value) => (
              <button
                key={value}
                onClick={() => setRuleKind(value as any)}
                className={`text-left rounded-md px-4 py-2 text-sm font-medium transition ${
                  ruleKind === value
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {value === 'PAY' && 'Grundlohn'}
                {value === 'BONUS' && 'Zuschlag'}
                {value === 'SPECIAL' && 'Sonderzahlung'}
              </button>
            ))}
          </div>
        </div>

        {/* Typ (nur bei PAY) */}
        {ruleKind === 'PAY' && (
          <div>
            <div className="text-sm font-semibold mb-2 text-gray-700">Typ</div>
            <div className="flex flex-col gap-2">
              {['HOURLY', 'MONTHLY'].map((value) => (
                <button
                  key={value}
                  onClick={() => setType(value as any)}
                  className={`text-left rounded-md px-4 py-2 text-sm font-medium transition ${
                    type === value
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {value === 'HOURLY' && 'Stundenlohn'}
                  {value === 'MONTHLY' && 'Monatsgehalt'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gruppe */}
        <div>
          <div className="text-sm font-semibold mb-2 text-gray-700">Gruppe (optional)</div>
          <input
            type="text"
            placeholder="z. B. Tarif A"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </aside>

      {/* Rechte Seite – Inhalt (75%) */}
      <main className="flex-1 p-10 overflow-auto">
        <div className="text-lg font-semibold mb-6 text-gray-800">🧪 Vorschau (Dummy-Bereich)</div>
        <div className="space-y-2 text-gray-700">
          <div>Regeltyp: <code>{ruleKind}</code></div>
          {ruleKind === 'PAY' && <div>Typ: <code>{type}</code></div>}
          <div>Gruppe: <code>{group || '–'}</code></div>
          <p className="text-gray-400 italic mt-4">
            Hier erscheinen später die passenden Eingabefelder und Einstellungen.
          </p>
        </div>
      </main>
    </div>
  </DialogContent>
</Dialog>

  )
}
