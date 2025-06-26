import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { PayRule } from '@/types/PayRule'
import RightPanelPreview from './RightPanelPreview'
import { Info } from 'lucide-react'

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
  const [menuOpen, setMenuOpen] = useState(true)

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
        </div>

        {/* Split View */}
        <div className="flex h-[calc(90vh-64px)] w-full">
          {/* Linkes Menü */}
          {menuOpen && (
            <aside className="w-full max-w-xs border-r bg-gray-50 p-6 space-y-8">
              {/* Basisdaten */}
              <div>
                <div className="flex items-center justify-between text-sm font-semibold mb-2 text-gray-700">
                  <span>💡 Art der Regel</span>
                  <Info className="h-4 w-4 text-gray-400" title="Wähle, ob es sich um Lohn, Zuschlag oder Sonderzahlung handelt." />
                </div>
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

              {/* Vergütungstyp */}
              {ruleKind === 'PAY' && (
                <div>
                  <div className="flex items-center justify-between text-sm font-semibold mb-2 text-gray-700">
                    <span>⏱️ Vergütungstyp</span>
                    <Info className="h-4 w-4 text-gray-400" title="Lege fest, ob Stundenlohn oder Monatsgehalt verwendet wird." />
                  </div>
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
                <div className="flex items-center justify-between text-sm font-semibold mb-2 text-gray-700">
                  <span>🏷️ Gruppe (optional)</span>
                  <Info className="h-4 w-4 text-gray-400" title="Optional: z. B. Tarif A oder Gruppe 1 zur Einordnung." />
                </div>
                <input
                  type="text"
                  placeholder="z. B. Tarif A"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Zusätzliche Optionen */}
              <div>
                <div className="flex items-center justify-between text-sm font-semibold mb-2 text-gray-700">
                  <span>➕ Zusätzliche Optionen</span>
                  <Info className="h-4 w-4 text-gray-400" title="Hier kannst du erweiterte Einstellungen wie Zeiträume oder Bedingungen hinzufügen." />
                </div>
                <div className="flex flex-col gap-2">
                  <button className="text-left text-sm text-blue-600 hover:underline">+ Zeitraum hinzufügen</button>
                  <button className="text-left text-sm text-blue-600 hover:underline">+ Bonusregel</button>
                  <button className="text-left text-sm text-blue-600 hover:underline">+ Bedingung</button>
                </div>
              </div>
            </aside>
          )}

          {/* Rechte Seite */}
          <div className="flex-1 relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="absolute left-2 top-2 z-10 rounded px-2 py-1 text-sm text-gray-600 border border-gray-300 bg-white hover:bg-gray-100 shadow"
            >
              {menuOpen ? '◀ Menü' : '▶ Menü'}
            </button>
            <RightPanelPreview ruleKind={ruleKind} type={type} group={group} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
