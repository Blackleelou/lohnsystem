// src/components/editor/toolbar/ToolbarGroupText.tsx

import { useEditorStore } from "../useEditorStore";

export default function ToolbarGroupText() {
  const { elements, updateElement } = useEditorStore();
  const selected = elements.find(el => el.selected);

  if (!selected) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-semibold text-gray-600">Text:</span>

      {/* Schriftart */}
<select
  className="border rounded px-1 py-0.5 text-sm"
  value={selected.fontFamily || "Arial"}
  onChange={(e) =>
    updateElement(selected.id, { fontFamily: e.target.value })
  }
>
  {["Arial", "Georgia", "Times New Roman", "Verdana", "Courier New", "Tahoma"].map((font) => (
    <option key={font} value={font}>
      {font}
    </option>
  ))}
</select>
      
      {/* Schriftgröße */}
      <select
        className="border rounded px-1 py-0.5 text-sm"
        value={selected.fontSize || 18}
        onChange={(e) =>
          updateElement(selected.id, { fontSize: parseInt(e.target.value) })
        }
      >
        {[12, 14, 16, 18, 20, 24, 28, 32, 40, 48].map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>

      {/* Farbe */}
      <input
        type="color"
        value={selected.fill || "#000000"}
        onChange={(e) => updateElement(selected.id, { fill: e.target.value })}
        className="w-8 h-6"
      />

      {/* Fett */}
      <button
        className={`px-2 py-1 border rounded text-sm font-bold ${
          selected.fontWeight === "bold" ? "bg-gray-200" : ""
        }`}
        onClick={() =>
          updateElement(selected.id, {
            fontWeight: selected.fontWeight === "bold" ? "normal" : "bold",
          })
        }
      >
        B
      </button>

      {/* Kursiv */}
      <button
        className={`px-2 py-1 border rounded text-sm italic ${
          selected.fontStyle === "italic" ? "bg-gray-200" : ""
        }`}
        onClick={() =>
          updateElement(selected.id, {
            fontStyle: selected.fontStyle === "italic" ? "normal" : "italic",
          })
        }
      >
        I
      </button>

      {/* Ausrichtung */}
      <select
        className="border rounded px-1 py-0.5 text-sm"
        value={selected.align || "left"}
        onChange={(e) =>
          updateElement(selected.id, { align: e.target.value as any })
        }
      >
        <option value="left">Links</option>
        <option value="center">Zentriert</option>
        <option value="right">Rechts</option>
      </select>
    </div>
  );
}
