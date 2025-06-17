import { useEditorStore } from "../useEditorStore";
import { useEditorFormatStore } from "../useEditorFormat";
import ToolbarSaveAsButton from "./ToolbarSaveAsButton";

export default function ToolbarGroupFile() {
  const elements = useEditorStore((s) => s.elements);
  const format = useEditorFormatStore((s) => s.format);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-semibold text-gray-600">Datei:</span>

      {/* Speichern-Button entfernt */}
      {/* Öffnen-Button entfernt */}

      <ToolbarSaveAsButton />

      <button
        className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
        onClick={() => window.print()}
      >
        Drucken
      </button>
    </div>
  );
}
