import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { PayRule } from '@/types/PayRule'

interface Props {
  onClose: () => void
  onCreate: (newRule: PayRule) => void
  prefillGroup?: string | null
  existingGroups: string[]
}

export default function CreatePayruleModal({ onClose }: Props) {
  const [ruleKind, setRuleKind] = useState<'PAY' | 'BONUS' | 'SPECIAL'>('PAY')
  const [type, setType] = useState<'HOURLY' | 'MONTHLY'>('HOURLY')
  const [group, setGroup] = useState('')

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent onOpenChange={onClose} className="rounded-2xl p-6 md:p-10 max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Neue Lohneinstellung</DialogTitle>
        </DialogHeader>

        <div className="mt-6 flex flex-col md:flex-row gap-8">
          {/* Linke Seite – Menü */}
          <div className="md:w-1/3 space-y-6">
            {/* Regeltyp */}
            <div>
              <div className="text-sm font-semibold mb-2 text-gray-700">Regeltyp</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'PAY', label: 'Grundlohn' },
                  { value: 'BONUS', label: 'Zuschlag' },
                  { value: 'SPECIAL', label: 'Sonderzahlung' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setRuleKind(item.value as any)}
                    className={`rounded-xl border px-3 py-4 text-sm shadow text-center transition ${
                      ruleKind === item.value
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PAY-spezifisch: Typ */}
            {ruleKind === 'PAY' && (
              <div>
                <div className="text-sm font-semibold mb-2 text-gray-700">Typ</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'HOURLY', label: 'Stundenlohn' },
                    { value: 'MONTHLY', label: 'Monatsgehalt' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setType(item.value as any)}
                      className={`rounded-xl border px-3 py-3 text-sm shadow transition ${
                        type === item.value
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
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
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Rechte Seite – Dummy-Feld */}
          <div className="flex-1 bg-gray-50 border rounded-xl shadow-inner p-6 text-gray-600 text-sm space-y-2">
            <div className="font-semibold text-gray-800">🧪 Vorschau (Dummy-Bereich)</div>
            <div>Regeltyp: <code>{ruleKind}</code></div>
            {ruleKind === 'PAY' && <div>Typ: <code>{type}</code></div>}
            <div>Gruppe: <code>{group || '–'}</code></div>
            <div className="mt-4 italic text-gray-400">Hier erscheinen später die passenden Eingabefelder.</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
