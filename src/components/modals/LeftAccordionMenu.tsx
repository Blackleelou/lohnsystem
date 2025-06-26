import { useState } from 'react';
import { Info } from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';

interface LeftAccordionMenuProps {
  ruleKind: 'PAY' | 'BONUS' | 'SPECIAL';
  setRuleKind: (val: 'PAY' | 'BONUS' | 'SPECIAL') => void;
  type: 'HOURLY' | 'MONTHLY';
  setType: (val: 'HOURLY' | 'MONTHLY') => void;
  group: string;
  setGroup: (val: string) => void;
}

export default function LeftAccordionMenu({ ruleKind, setRuleKind, type, setType, group, setGroup }: LeftAccordionMenuProps) {
  const [openSection, setOpenSection] = useState<string | null>('kind');

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  return (
    <aside className="w-full max-w-xs border-r bg-gray-50 p-6 space-y-6 overflow-y-auto">
      {/* Art der Regel */}
      <div>
        <button onClick={() => toggleSection('kind')} className="w-full text-left font-semibold text-sm text-gray-700 mb-2 flex justify-between items-center">
          <span>💡 Art der Regel</span>
          <Tooltip>Wähle, ob es sich um Lohn, Zuschlag oder Sonderzahlung handelt.</Tooltip>
        </button>
        {openSection === 'kind' && (
          <div className="flex flex-col gap-2">
            {['PAY', 'BONUS', 'SPECIAL'].map((value) => (
              <button
                key={value}
                onClick={() => setRuleKind(value as any)}
                className={`text-left rounded-md px-4 py-2 text-sm font-medium transition ${
                  ruleKind === value ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
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
          <button onClick={() => toggleSection('type')} className="w-full text-left font-semibold text-sm text-gray-700 mb-2 flex justify-between items-center">
            <span>⏱️ Vergütungstyp</span>
            <Tooltip>Lege fest, ob Stundenlohn oder Monatsgehalt verwendet wird.</Tooltip>
          </button>
          {openSection === 'type' && (
            <div className="flex flex-col gap-2">
              {['HOURLY', 'MONTHLY'].map((value) => (
                <button
                  key={value}
                  onClick={() => setType(value as any)}
                  className={`text-left rounded-md px-4 py-2 text-sm font-medium transition ${
                    type === value ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
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
        <button onClick={() => toggleSection('group')} className="w-full text-left font-semibold text-sm text-gray-700 mb-2 flex justify-between items-center">
          <span>🏷️ Gruppe (optional)</span>
          <Tooltip>Optional: z. B. Tarif A oder Gruppe 1 zur Einordnung.</Tooltip>
        </button>
        {openSection === 'group' && (
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
        <button onClick={() => toggleSection('extras')} className="w-full text-left font-semibold text-sm text-gray-700 mb-2 flex justify-between items-center">
          <span>➕ Zusätzliche Optionen</span>
          <Tooltip>Hier kannst du z. B. Zeiträume oder Bedingungen hinzufügen.</Tooltip>
        </button>
        {openSection === 'extras' && (
          <div className="flex flex-col gap-2">
            <button className="text-left text-sm text-blue-600 hover:underline">+ Zeitraum hinzufügen</button>
            <button className="text-left text-sm text-blue-600 hover:underline">+ Bonusregel</button>
            <button className="text-left text-sm text-blue-600 hover:underline">+ Bedingung</button>
          </div>
        )}
      </div>
    </aside>
  );
}
