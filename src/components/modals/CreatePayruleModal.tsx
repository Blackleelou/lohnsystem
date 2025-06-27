import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { PayRule } from '@/types/PayRule';
import TopAccordionMenu from './TopAccordionMenu';
import BelowPanelPreview from './BelowPanelPreview';
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

        {/* Top-Bottom View */}
        <div className="flex flex-col h-[calc(90vh-64px)] w-full">

          {/* Oberes Menü (25%) */}
          <div className="flex-[1_1_0%] overflow-y-auto border-b">
            <TopAccordionMenu
              ruleKind={ruleKind}
              type={type}
              group={group}
              setRuleKind={setRuleKind}
              setType={setType}
              setGroup={setGroup}
            />
          </div>

          {/* Untere Vorschau (75%) */}
          <div className="flex-[3_3_0%] overflow-y-auto">
            <BelowPanelPreview ruleKind={ruleKind} type={type} group={group} />
          </div>

          {/* Info Overlays */}
          <InfoOverlay />
        </div>
      </DialogContent>
    </Dialog>
  );
}
