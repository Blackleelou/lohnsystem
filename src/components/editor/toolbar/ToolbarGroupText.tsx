import { useEditorStore } from "../useEditorStore";

export default function ToolbarGroupText() {
  const selectedElement = useEditorStore((s) =>
    s.elements.find((el) => el.selected && el.type === "text")
  );
  const updateElement = useEditorStore((s) => s.updateElement);

  return (
    <div className="flex items-center gap-2">
      {/* Schriftart */}
      <select
        value={selectedElement?.fontFamily || "Arial"}
        onChange={(e) => {
          if (selectedElement) {
            updateElement(selectedElement.id, {
              fontFamily: e.target.value,
            });
          }
        }}
        className="text-sm px-2 py-1 border rounded hover:border-gray-400"
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Calibri">Calibri</option>
        <option value="Verdana">Verdana</option>
        <option value="Georgia">Georgia</option>
        <option value="Comic Sans MS">Comic Sans MS</option>
        <option value="Courier New">Courier New</option>
        <option value="Tahoma">Tahoma</option>
        <option value="Lucida Console">Lucida Console</option>
      </select>

      {/* Schriftgröße */}
<select
  value={selectedElement?.fontSize || 14}
  onChange={(e) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        fontSize: Number(e.target.value),
      });
    }
  }}
  className="text-sm px-2 py-1 w-20 border rounded hover:border-gray-400 appearance-none bg-white pr-6"
  style={{
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg fill='none' stroke='gray' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.5rem center",
    backgroundSize: "1rem 1rem",
  }}
>
  {[8, 10, 12, 14, 16, 18, 24, 32, 40, 48].map((s) => (
    <option key={s} value={s}>
      {s} pt
    </option>
  ))}
</select>


      {/* Schriftfarbe */}
      <input
        type="color"
        value={selectedElement?.fill || "#000000"}
        onChange={(e) => {
          if (selectedElement) {
            updateElement(selectedElement.id, {
              fill: e.target.value,
            });
          }
        }}
        className="w-8 h-8 p-0 border rounded"
        title="Schriftfarbe"
      />
    </div>
  );
}
