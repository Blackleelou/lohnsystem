// src/components/editor/EditorToolbar.tsx
import { useEditorStore } from "./useEditorStore";

export default function EditorToolbar() {
  const { elements, updateElement, addText } = useEditorStore();
  const selected = elements.find(el => el.selected);

  const handleChange = (prop: string, value: any) => {
    if (!selected) return;
    updateElement(selected.id, { [prop]: value });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        className="px-2 py-1 border rounded text-sm"
        onClick={() => addText()}
      >
        ➕ Neuer Text
      </button>

      {selected && (
        <>
          <select
            value={selected.fontSize || 18}
            onChange={e => handleChange("fontSize", parseInt(e.target.value))}
            className="px-2 py-1 border rounded text-sm"
          >
            {[12, 14, 16, 18, 24, 32, 48].map(size => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>

          <input
            type="color"
            value={selected.fill || "#000000"}
            onChange={e => handleChange("fill", e.target.value)}
            className="w-8 h-8 p-0 border"
          />

          <button
            className="px-2 py-1 border rounded text-sm"
            onClick={() =>
              handleChange(
                "fontWeight",
                selected.fontWeight === "bold" ? "normal" : "bold"
              )
            }
          >
            <strong>B</strong>
          </button>

          <button
            className="px-2 py-1 border rounded text-sm italic"
            onClick={() =>
              handleChange(
                "fontStyle",
                selected.fontStyle === "italic" ? "normal" : "italic"
              )
            }
          >
            i
          </button>

          <select
            value={selected.align || "left"}
            onChange={e => handleChange("align", e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="left">Links</option>
            <option value="center">Zentriert</option>
            <option value="right">Rechts</option>
          </select>
        </>
      )}
    </div>
  );
}
