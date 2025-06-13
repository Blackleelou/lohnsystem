import dynamic from "next/dynamic";
import { useState } from "react";
import EditorToolbar from "./EditorToolbar";
import EditorCanvas from "./EditorCanvas";

export default function EditorRoot() {
  const [paperSize, setPaperSize] = useState<"A4" | "A5" | "A6">("A4");

  const getDimensions = () => {
    switch (paperSize) {
      case "A5":
        return { width: 420, height: 595 }; // halbes A4
      case "A6":
        return { width: 298, height: 420 }; // halbes A5
      case "A4":
      default:
        return { width: 595, height: 842 }; // A4 in pt (72dpi)
    }
  };

  const { width, height } = getDimensions();

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      {/* Auswahl Papiergröße */}
      <div className="mb-4 flex gap-2">
        {["A4", "A5", "A6"].map((size) => (
          <button
            key={size}
            className={`px-3 py-1 rounded border ${
              paperSize === size ? "bg-blue-600 text-white" : "bg-white text-black"
            }`}
            onClick={() => setPaperSize(size as "A4" | "A5" | "A6")}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Werkzeugleiste */}
      <EditorToolbar />

      {/* Zeichenfläche */}
      <div className="mt-4 shadow-lg border bg-white">
        <EditorCanvas width={width} height={height} />
      </div>
    </div>
  );
}
