import { useEffect } from "react";
import EditorCanvas from "./EditorCanvas";
import { useCanvasSize } from "./useCanvasSize";
import { useEditorFormatStore } from "./useEditorFormat";

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

  // 💾 Format im localStorage speichern
  useEffect(() => {
    localStorage.setItem("editor-format", format);
  }, [format]);

  // 📏 Skalierung berechnen: passt Canvas an Bildschirmbreite an (mit etwas Padding)
  const maxWidth = typeof window !== "undefined" ? window.innerWidth : 375;
  const scale = maxWidth < width + 40 ? maxWidth / (width + 40) : 1;

  return (
    <div className="w-full flex justify-center overflow-auto px-2">
      <div
        className="relative bg-white shadow-xl border rounded"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "transform 0.3s ease-in-out", // 🎬 Smooth animation
          margin: "2rem 0",
        }}
      >
        <EditorCanvas width={width} height={height} />
      </div>
    </div>
  );
}
