import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { PayRule } from '@/types/PayRule'
import RightPanelPreview from './RightPanelPreview'
import { Info } from 'lucide-react'
import LeftAccordionMenu from './LeftAccordionMenu'

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
            <aside className="w-full max-w-xs border-r bg-gray-50 p-0 overflow-y-auto">
              <LeftAccordionMenu
                ruleKind={ruleKind}
                setRuleKind={setRuleKind}
                type={type}
                setType={setType}
                group={group}
                setGroup={setGroup}
              />
            </aside>
          )}

          {/* Rechte Seite */}
          <div className="flex-1 relative overflow-auto">
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
