import { useEffect } from "react";
import EditorCanvas from "./EditorCanvas";
import { useCanvasSize } from "./useCanvasSize";
import { useEditorFormatStore } from "./useEditorFormat";
import { useEditorStore } from "./useEditorStore";

export default function EditorCanvasWrapper() {
  const { width, height } = useCanvasSize();
  const format = useEditorFormatStore((s) => s.format);
  const setFormat = useEditorFormatStore((s) => s.setFormat);
  const clearElements = useEditorStore((s) => s.clearElements);

  // Format aus localStorage laden
  useEffect(() => {
    const saved = localStorage.getItem("editor-format");
    if (saved === "a4" || saved === "a5" || saved === "a6") {
      setFormat(saved);
    }
  }, [setFormat]);

  // Format speichern
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
    <div className="flex flex-col items-center w-full">
      <button
        onClick={handleReset}
        className="text-xs text-gray-500 underline mt-4 mb-2"
      >
        Editor zurücksetzen
      </button>

      <div className="w-full flex justify-center overflow-auto px-2">
        <EditorCanvas width={width} height={height} />
      </div>
    </div>
  );
}
