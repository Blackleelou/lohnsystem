import { useEffect } from "react";
import EditorCanvas from "./EditorCanvas";
import EditorHeader from "./EditorHeader";
import { useCanvasSize } from "./useCanvasSize";
import { useEditorFormatStore } from "./useEditorFormat";
import { useEditorStore } from "./useEditorStore";

export default function EditorCanvasWrapper() {
  const { width, height } = useCanvasSize();
  const format = useEditorFormatStore((s) => s.format);
  const setFormat = useEditorFormatStore((s) => s.setFormat);
  const clearElements = useEditorStore((s) => s.clearElements);

  // 🧠 Format aus localStorage laden
  useEffect(() => {
    const saved = localStorage.getItem("editor-format");
    if (saved === "a4" || saved === "a5" || saved === "a6") {
      setFormat(saved);
    }
  }, [setFormat]);

  // 💾 Format im localStorage speichern
  useEffect(() => {
    localStorage.setItem("editor-format", format);
  }, [format]);

  const handleReset = () => {
    localStorage.removeItem("editor-format");
    setFormat("a4");
    clearElements();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
      {/* 🔝 Moderne Toolbar mit Dropdown-Auswahl */}
      <EditorHeader />

      {/* 🖼 Zeichenfläche */}
      <div className="w-full flex justify-center overflow-auto px-2 py-6">
        <EditorCanvas width={width} height={height} />
      </div>

      {/* 🧹 Zurücksetzen */}
      <button
        onClick={handleReset}
        className="text-xs text-gray-400 underline mt-4 mb-6"
      >
        Editor zurücksetzen
      </button>
    </div>
  );
}
