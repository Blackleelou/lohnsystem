// src/components/editor/toolbar/ToolbarGroupFile.tsx

export default function ToolbarGroupFile() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-600">Datei:</span>

      <button
        className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
        onClick={() => alert("Speichern folgt")}
      >
        Speichern
      </button>

      <button
        className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
        onClick={() => window.print()}
      >
        Drucken
      </button>
    </div>
  );
}
