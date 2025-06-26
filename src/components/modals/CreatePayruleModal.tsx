import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { PayRule } from '@/types/PayRule'
import RightPanelPreview from './RightPanelPreview' // ausgelagertes rechtes Panel
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
          {/* Linke Seite – Menü */}
          <div className={`relative transition-all duration-300 ${menuOpen ? 'w-[25%] max-w-xs' : 'w-6'} bg-gray-50 border-r`}> 
            {menuOpen && (
              <div className="p-6 space-y-8">
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
              </div>
            )}

            {/* Toggle Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="absolute top-4 right-[-16px] z-10 rounded-full bg-white border border-gray-300 p-1 shadow hover:bg-gray-100"
              title={menuOpen ? 'Menü einklappen' : 'Menü ausklappen'}
            >
              {menuOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Rechte Seite – ausgelagert */}
          <RightPanelPreview ruleKind={ruleKind} type={type} group={group} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
