// src/components/editor/toolbar/ToolbarSaveAsButton.tsx

import { useState } from "react";
import { useEditorStore } from "../useEditorStore";
import { useEditorFormatStore } from "../useEditorFormat";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";

export default function ToolbarSaveAsButton() {
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<"PRIVATE" | "TEAM" | "SHARED" | "PUBLIC">("PRIVATE");
  const [saving, setSaving] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const elements = useEditorStore((s) => s.elements);
  const format = useEditorFormatStore((s) => s.format);
  const { data: session } = useSession();

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
          visibility,
          companyId: session?.user?.companyId ?? null,
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
        <div className="flex items-center gap-2 bg-white p-2 shadow rounded">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Dokumenttitel"
            className="border rounded px-2 py-1 text-sm"
          />
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as any)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="PRIVATE">🔒 Privat</option>
            <option value="TEAM">👥 Team</option>
            <option value="SHARED">🔗 Geteilt</option>
            <option value="PUBLIC">🌍 Öffentlich</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Speichern
          </button>
          <button
            onClick={() => setShowInput(false)}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            Abbrechen
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          title="Speichern unter"
          className="p-2 hover:bg-gray-100 rounded"
        >
          <HiOutlineDocumentDuplicate size={20} />
        </button>
      )}
    </div>
  );
}
