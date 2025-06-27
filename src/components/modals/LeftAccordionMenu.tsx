import { useState } from 'react';
import { Info } from 'lucide-react';

interface LeftAccordionMenuProps {
  ruleKind: 'PAY' | 'BONUS' | 'SPECIAL';
  type: 'HOURLY' | 'MONTHLY';
  group: string;
  setRuleKind: (val: 'PAY' | 'BONUS' | 'SPECIAL') => void;
  setType: (val: 'HOURLY' | 'MONTHLY') => void;
  setGroup: (val: string) => void;
}

export default function LeftAccordionMenu({
  ruleKind,
  type,
  group,
  setRuleKind,
  setType,
  setGroup,
}: LeftAccordionMenuProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    rule: true,
    type: true,
    group: true,
    extra: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const TooltipIcon = ({ text }: { text: string }) => (
    <div className="relative group">
      <Info className="h-4 w-4 text-gray-400 cursor-help" />
      <div className="absolute z-10 hidden w-48 rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block left-6 top-1">
        {text}
      </div>
    </div>
  );

  return (
    <aside className="w-full max-w-xs border-r bg-gray-50 p-4 space-y-6 overflow-y-auto max-h-full">
      {/* Regelart */}
      <div>
        <button
          className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 mb-1"
          onClick={() => toggleSection('rule')}
        >
          <span className="flex items-center gap-2">
            <span className="text-blue-500">💡</span>
            Art der Regel
          </span>
          <TooltipIcon text="Wähle, ob es sich um Lohn, Zuschlag oder Sonderzahlung handelt." />
        </button>
        {openSections.rule && (
          <div className="mt-2 space-y-1">
            <button
              onClick={() => setRuleKind('PAY')}
              className={`w-full px-4 py-2 text-left text-sm rounded-md hover:bg-gray-100 ${
                ruleKind === 'PAY' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
              }`}
            >
              Grundlohn
            </button>
            <button
              onClick={() => setRuleKind('BONUS')}
              className={`w-full px-4 py-2 text-left text-sm rounded-md hover:bg-gray-100 ${
                ruleKind === 'BONUS' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
              }`}
            >
              Zuschlag
            </button>
            <button
              onClick={() => setRuleKind('SPECIAL')}
              className={`w-full px-4 py-2 text-left text-sm rounded-md hover:bg-gray-100 ${
                ruleKind === 'SPECIAL' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
              }`}
            >
              Sonderzahlung
            </button>
          </div>
        )}
      </div>

      {/* Vergütungstyp */}
      {ruleKind === 'PAY' && (
        <div>
          <button
            className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 mb-1"
            onClick={() => toggleSection('type')}
          >
            <span className="flex items-center gap-2">
              <span className="text-blue-500">⏱️</span>
              Vergütungstyp
            </span>
            <TooltipIcon text="Lege fest, ob Stundenlohn oder Monatsgehalt verwendet wird." />
          </button>
          {openSections.type && (
            <div className="mt-2 space-y-1">
              <button
                onClick={() => setType('HOURLY')}
                className={`w-full px-4 py-2 text-left text-sm rounded-md hover:bg-gray-100 ${
                  type === 'HOURLY' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
              >
                Stundenlohn
              </button>
              <button
                onClick={() => setType('MONTHLY')}
                className={`w-full px-4 py-2 text-left text-sm rounded-md hover:bg-gray-100 ${
                  type === 'MONTHLY' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
              >
                Monatsgehalt
              </button>
            </div>
          )}
        </div>
      )}

      {/* Gruppe */}
      <div>
        <button
          className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 mb-1"
          onClick={() => toggleSection('group')}
        >
          <span className="flex items-center gap-2">
            <span className="text-blue-500">🏷️</span>
            Gruppe (optional)
          </span>
          <TooltipIcon text="Optional: z. B. Tarif A oder Gruppe 1 zur Einordnung." />
        </button>
        {openSections.group && (
          <input
            type="text"
            placeholder="z. B. Tarif A"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
        )}
      </div>

      {/* Zusätzliche Optionen */}
      <div>
        <button
          className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 mb-1"
          onClick={() => toggleSection('extra')}
        >
          <span className="flex items-center gap-2">
            <span className="text-blue-500">➕</span>
            Zusätzliche Optionen
          </span>
          <TooltipIcon text="Hier kannst du erweiterte Einstellungen wie Zeiträume oder Bedingungen hinzufügen." />
        </button>
        {openSections.extra && (
          <div className="mt-2 space-y-1">
            <button className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:underline rounded-md">
              + Zeitraum hinzufügen
            </button>
           
