import { useState } from "react";
import EditorCanvas from "./EditorCanvas";

const pageSizes = {
  A4: { width: 794, height: 1123 }, // 210 × 297 mm @ 96 DPI
  A5: { width: 559, height: 794 },
  A6: { width: 397, height: 559 },
};

export default function EditorRoot() {
  const [format, setFormat] = useState<"A4" | "A5" | "A6">("A4");

  return (
    <div className="p-4 border border-gray-300 rounded shadow">
      <div className="mb-4 flex gap-2 text-sm items-center">
        <label className="font-medium">Format:</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as "A4" | "A5" | "A6")}
          className="border px-2 py-1 rounded"
        >
          <option value="A4">A4 (Standard)</option>
          <option value="A5">A5</option>
          <option value="A6">A6</option>
        </select>
      </div>

      <EditorCanvas
        width={pageSizes[format].width}
        height={pageSizes[format].height}
      />
    </div>
  );
}
