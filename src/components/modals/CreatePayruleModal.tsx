// src/components/modals/CreatePayruleModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { PayRule } from '@/types/PayRule';
import RightPanelPreview from './TopPanelPreview';
import LeftAccordionMenu from './BelowAccordionMenu';
import InfoOverlay from './InfoOverlay';

interface Props {
  onClose: () => void;
  onCreate: (newRule: PayRule) => void;
  prefillGroup?: string | null;
  existingGroups: string[];
}

export default function CreatePayruleModal({ onClose, onCreate, prefillGroup, existingGroups }: Props) {
  const [ruleKind, setRuleKind] = React.useState<'PAY' | 'BONUS' | 'SPECIAL'>('PAY');
  const [type, setType] = React.useState<'HOURLY' | 'MONTHLY'>('HOURLY');
  const [group, setGroup] = React.useState(prefillGroup || '');
  const [menuOpen, setMenuOpen] = React.useState(true);

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
        <div className="flex flex-col h-[calc(90vh-64px)] w-full">
          {/* Einklappbarer Button über dem linken Menü */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="absolute top-[6px] left-[10px] z-20 bg-white border border-gray-300 rounded-full p-1 text-black shadow hover:bg-gray-100"
            title={menuOpen ? 'Menü einklappen' : 'Menü anzeigen'}
          >
            {menuOpen ? '▲' : '▼'}
          </button>

          {/* Menü oben */}
          {menuOpen && (
            <LeftAccordionMenu
              ruleKind={ruleKind}
              type={type}
              group={group}
              setRuleKind={setRuleKind}
              setType={setType}
              setGroup={setGroup}
            />
          )}

          {/* Menü unten */}
          <div className="flex-1 relative overflow-y-auto">
            <RightPanelPreview ruleKind={ruleKind} type={type} group={group} />
          </div>

          {/* Info Overlays */}
          <InfoOverlay />
        </div>
      </DialogContent>
    </Dialog>
  );
}
