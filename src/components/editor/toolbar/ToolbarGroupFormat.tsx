import { useEditorFormatStore } from "../useEditorFormat";
import { useState } from "react";

export default function EditorToolbarFormat() {
  const format = useEditorFormatStore((s) => s.format);
  const setFormat = useEditorFormatStore((s) => s.setFormat);
  const [open, setOpen] = useState(false);

  const options = ["a4", "a5", "a6"];

  return (
    <div className="relative text-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1 border rounded border-gray-300 bg-white hover:bg-gray-100"
      >
        <span className="text-gray-800 font-medium">Format: {format.toUpperCase()}</span>
        <span className="text-gray-500">▼</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-1 bg-white border border-gray-300 rounded shadow-md z-10 w-36">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setFormat(opt as "a4" | "a5" | "a6");
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1 hover:bg-gray-100 ${
                format === opt ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-800"
              }`}
            >
              {opt.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
