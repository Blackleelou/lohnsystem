import { useEditorStore } from "./useEditorStore";

export default function EditorToolbar() {
  const { elements, updateElement } = useEditorStore();
  const selectedElement = elements.find((el) => el.selected);

  if (!selectedElement) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
      <label>Größe:</label>
      <input
        type="number"
        value={selectedElement.fontSize || 18}
        onChange={(e) =>
          updateElement(selectedElement.id, {
            fontSize: parseInt(e.target.value),
          })
        }
        className="border rounded px-2 py-1 w-16"
      />

      <label>Schrift:</label>
      <select
        value={selectedElement.fontFamily || "Arial"}
        onChange={(e) =>
          updateElement(selectedElement.id, {
            fontFamily: e.target.value,
          })
        }
        className="border rounded px-2 py-1"
      >
        <option value="Arial">Arial</option>
        <option value="Verdana">Verdana</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
      </select>

      <label>Farbe:</label>
      <input
        type="color"
        value={selectedElement.fill || "#000000"}
        onChange={(e) =>
          updateElement(selectedElement.id, { fill: e.target.value })
        }
      />

      <button
        onClick={() =>
          updateElement(selectedElement.id, {
            fontWeight:
              selectedElement.fontWeight === "bold" ? "normal" : "bold",
          })
        }
        className={`border px-2 py-1 rounded font-bold ${
          selectedElement.fontWeight === "bold"
            ? "bg-gray-200"
            : "bg-white"
        }`}
      >
        B
      </button>

      <button
        onClick={() =>
          updateElement(selectedElement.id, {
            fontStyle:
              selectedElement.fontStyle === "italic" ? "normal" : "italic",
          })
        }
        className={`border px-2 py-1 rounded italic ${
          selectedElement.fontStyle === "italic"
            ? "bg-gray-200"
            : "bg-white"
        }`}
      >
        I
      </button>

      <label>Ausrichtung:</label>
      <select
        value={selectedElement.align || "left"}
        onChange={(e) =>
          updateElement(selectedElement.id, {
            align: e.target.value as any,
          })
        }
        className="border rounded px-2 py-1"
      >
        <option value="left">Links</option>
        <option value="center">Zentriert</option>
        <option value="right">Rechts</option>
      </select>
    </div>
  );
}
