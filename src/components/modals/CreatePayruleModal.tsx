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
        className="w-full max-w-[1000px] md:min-w-[900px] mt-10 p-10 rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Neue Lohneinstellung</DialogTitle>
        </DialogHeader>

        <div className="mt-10 flex flex-col md:flex-row gap-12">
          {/* Linke Spalte: Auswahl */}
          <div className="md:w-2/5 space-y-8">
            {/* Regeltyp */}
            <div>
              <div className="text-sm font-semibold mb-3 text-gray-700">Regeltyp</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4">
                {[
                  { value: 'PAY', label: 'Grundlohn' },
                  { value: 'BONUS', label: 'Zuschlag' },
                  { value: 'SPECIAL', label: 'Sonderzahlung' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setRuleKind(item.value as any)}
                    className={`rounded-xl border px-6 py-4 text-base font-medium text-center transition-all
                      ${ruleKind === item.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Typ (nur bei PAY) */}
            {ruleKind === 'PAY' && (
              <div>
                <div className="text-sm font-semibold mb-3 text-gray-700">Typ</div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'HOURLY', label: 'Stundenlohn' },
                    { value: 'MONTHLY', label: 'Monatsgehalt' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setType(item.value as any)}
                      className={`rounded-xl border px-6 py-4 text-base font-medium text-center transition-all
                        ${type === item.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gruppe */}
            <div>
              <div className="text-sm font-semibold mb-3 text-gray-700">Gruppe (optional)</div>
              <input
                type="text"
                placeholder="z. B. Tarif A"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Rechte Spalte: Dummy-Vorschau */}
          <div className="md:w-3/5 bg-gray-50 border rounded-xl shadow-inner p-8 text-gray-700 text-base space-y-3">
            <div className="font-semibold text-gray-800 text-lg">🧪 Vorschau (Dummy-Bereich)</div>
            <div>Regeltyp: <code>{ruleKind}</code></div>
            {ruleKind === 'PAY' && <div>Typ: <code>{type}</code></div>}
            <div>Gruppe: <code>{group || '–'}</code></div>
            <div className="pt-4 italic text-gray-400">Hier erscheinen später die passenden Eingabefelder.</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
