interface BelowPanelPreviewProps {
  ruleKind: 'PAY' | 'BONUS' | 'SPECIAL';
  type: 'HOURLY' | 'MONTHLY';
  group: string;
}

export default function BelowPanelPreview({ ruleKind, type, group }: BelowPanelPreviewProps) {
  return (
    <main className="h-full w-full p-6 overflow-y-auto">
      <div className="text-lg font-semibold mb-6 text-gray-800">🧪 Vorschau (Dummy-Bereich)</div>
      <div className="space-y-2 text-gray-700">
        <div>Regeltyp: <code>{ruleKind}</code></div>
        {ruleKind === 'PAY' && <div>Typ: <code>{type}</code></div>}
        <div>Gruppe: <code>{group || '–'}</code></div>
        <p className="text-gray-400 italic mt-4">
          Hier erscheinen später die passenden Eingabefelder und Einstellungen basierend auf der Auswahl.
        </p>
      </div>
    </main>
  );
}
