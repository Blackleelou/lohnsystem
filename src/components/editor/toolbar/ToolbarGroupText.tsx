// src/components/editor/toolbar/ToolbarGroupText.tsx

import { useEditorFormatStore } from "../useEditorFormat";

export default function ToolbarGroupText() {
  const fontFamily    = useEditorFormatStore((s) => s.fontFamily);
  const setFontFamily = useEditorFormatStore((s) => s.setFontFamily);
  const fontSize      = useEditorFormatStore((s) => s.fontSize);
  const setFontSize   = useEditorFormatStore((s) => s.setFontSize);
  const fontColor     = useEditorFormatStore((s) => s.fontColor);
  const setFontColor  = useEditorFormatStore((s) => s.setFontColor);

  return (
    <div className="flex items-center gap-2">
      {/* Schriftart */}
      <select
        value={fontFamily}
        onChange={(e) => setFontFamily(e.target.value)}
        className="text-sm px-2 py-1 border rounded hover:border-gray-400"
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Calibri">Calibri</option>
        <option value="Verdana">Verdana</option>
      </select>

      {/* Schriftgröße */}
      <select
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
        className="text-sm px-2 py-1 border rounded hover:border-gray-400"
      >
        {[8,10,12,14,16,18,24,32].map((s) => (
          <option key={s} value={s}>
            {s} pt
          </option>
        ))}
      </select>

      {/* Schriftfarbe */}
      <input
        type="color"
        value={fontColor}
        onChange={(e) => setFontColor(e.target.value)}
        className="w-8 h-8 p-0 border rounded"
      />
    </div>
  );
}
