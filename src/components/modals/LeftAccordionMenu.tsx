import { Info } from 'lucide-react';
import { useState } from 'react';

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

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
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
    <aside className="w-full max-w-xs border-r bg-gray-50 p-4 space-y-6 overflow-y-auto">
      {/* Art der Regel */}
      <div>
        <button
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-700 mb-1"
          onClick={() => toggleSection('rule')}
        >
          <span>💡 Art der Regel</span>
          <TooltipIcon text="Wähle, ob es sich um Lohn, Zuschlag oder Sonderzahlung handelt." />
        </button>
        {openSections.rule && (
          <div className="flex flex-col gap-2 mt-1">
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
        )}
      </div>

      {/* Vergütungstyp */}
      {ruleKind === 'PAY' && (
        <div>
          <button
            className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-700 mb-1"
            onClick={() => toggleSection('type')}
          >
            <span>⏱️ Vergütungstyp</span>
            <TooltipIcon text="Lege fest, ob Stundenlohn oder Monatsgehalt verwendet wird." />
          </button>
          {openSections.type && (
            <div className="flex flex-col gap-2 mt-1">
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
          )}
        </div>
      )}

      {/* Gruppe */}
      <div>
        <button
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-700 mb-1"
          onClick={() => toggleSection('group')}
        >
          <span>🏷️ Gruppe (optional)</span>
          <TooltipIcon text="Optional: z. B. Tarif A oder Gruppe 1 zur Einordnung." />
        </button>
        {openSections.group && (
          <input
            type="text"
            placeholder="z. B. Tarif A"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* Zusätzliche Optionen */}
      <div>
        <button
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-700 mb-1"
          onClick={() => toggleSection('extra')}
        >
          <span>➕ Zusätzliche Optionen</span>
          <TooltipIcon text="Hier kannst du erweiterte Einstellungen wie Zeiträume oder Bedingungen hinzufügen." />
        </button>
        {openSections.extra && (
          <div className="flex flex-col gap-2 mt-1">
            <button className="text-left text-sm text-blue-600 hover:underline">+ Zeitraum hinzufügen</button>
            <button className="text-left text-sm text-blue-600 hover:underline">+ Bonusregel</button>
            <button className="text-left text-sm text-blue-600 hover:underline">+ Bedingung</button>
          </div>
        )}
      </div>
    </aside>
  );
}
