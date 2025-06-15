import { useState } from "react";
import { useEditorStore } from "../useEditorStore";
import { useEditorFormatStore } from "../useEditorFormat";
import { toast } from "react-hot-toast";

export default function ToolbarSaveAsButton() {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const elements = useEditorStore((s) => s.elements);
  const format = useEditorFormatStore((s) => s.format);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Bitte gib einen Titel ein");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/editor/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: elements,
          format,
          visibility: "PRIVATE", // Standardwert
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Speichern");

      toast.success("Dokument gespeichert!");
      setShowInput(false);
      setTitle("");
    } catch (err: any) {
      toast.error(err.message || "Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Dokumenttitel"
            className="border rounded px-2 py-1 text-sm"
          />
          <button
            className="px-2 py-1 border rounded text-sm bg-blue-500 text-white"
            onClick={handleSave}
            disabled={saving}
          >
            Speichern
          </button>
          <button
            className="text-sm text-gray-500 underline"
            onClick={() => setShowInput(false)}
          >
            Abbrechen
          </button>
        </div>
      ) : (
        <button
          className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
          onClick={() => setShowInput(true)}
        >
          Speichern unter …
        </button>
      )}
    </div>
  );
}
