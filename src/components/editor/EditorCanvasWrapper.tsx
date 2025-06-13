// src/components/editor/EditorCanvasWrapper.tsx

import EditorCanvas from "./EditorCanvas";
import { useCanvasSize } from "./useCanvasSize";
import { useEditorFormatStore } from "./useEditorFormat";
import { useEffect } from "react";

export default function EditorCanvasWrapper() {
  const { width, height } = useCanvasSize();
  const format = useEditorFormatStore((s) => s.format);
  const setFormat = useEditorFormatStore((s) => s.setFormat);

  // 🧠 Format aus localStorage merken (bei Reload)
  useEffect(() => {
    const saved = localStorage.getItem("editor-format");
    if (saved === "a4" || saved === "a5" || saved === "a6") {
      setFormat(saved);
    }
  }, [setFormat]);

  useEffect(() => {
    localStorage.setItem("editor-format", format);
  }, [format]);

  // 🔍 Bildschirmbreite prüfen für dynamische Skalierung
  const maxWidth = typeof window !== "undefined" ? window.innerWidth : 375;
  const scale = maxWidth < width + 40 ? maxWidth / (width + 40) : 1;

  return (
    <div className="overflow-auto w-full flex justify-center">
      <div
        className="bg-white shadow-xl border rounded relative"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          margin: "2rem 0",
        }}
      >
        <EditorCanvas width={width} height={height} />
      </div>
    </div>
  );
}
