import { useEditorStore } from "../useEditorStore";
import { useEditorFormatStore } from "../useEditorFormat";
import { toast } from "react-hot-toast";
import ToolbarSaveAsButton from "./ToolbarSaveAsButton";
import ToolbarOpenButton from "./ToolbarOpenButton";

export default function ToolbarGroupFile() {
  const elements = useEditorStore((s) => s.elements);
  const format = useEditorFormatStore((s) => s.format);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/editor/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Neues Dokument",
          content: elements,
          format,
          visibility: "PRIVATE",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");

      toast.success("Dokument gespeichert!");
      console.log("Gespeichert:", data.document);
    } catch (err: any) {
      toast.error(err.message || "Fehler beim Speichern");
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-semibold text-gray-600">Datei:</span>

      <button
        className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
        onClick={handleSave}
      >
        Speichern
      </button>

      <ToolbarOpenButton />
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
