import { useEffect, useRef, useState } from "react";
import EditorCanvas from "./EditorCanvas";
import { useCanvasSize } from "./useCanvasSize";
import { useEditorFormatStore } from "./useEditorFormat";

export default function EditorCanvasWrapper() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const { width, height } = useCanvasSize();
  const format = useEditorFormatStore((s) => s.format);
  const setFormat = useEditorFormatStore((s) => s.setFormat);

  // 🧠 Format aus localStorage merken
  useEffect(() => {
    const saved = localStorage.getItem("editor-format");
    if (saved === "a4" || saved === "a5" || saved === "a6") {
      setFormat(saved);
    }
  }, [setFormat]);

  // 💾 Speichern im localStorage
  useEffect(() => {
    localStorage.setItem("editor-format", format);
  }, [format]);

  // 📏 Dynamische Skalierung anhand Containergröße
  useEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const newScale = containerWidth < width + 40 ? containerWidth / (width + 40) : 1;
    setScale(newScale);
  }, [width]);

  return (
    <div ref={containerRef} className="w-full flex justify-center overflow-auto px-2">
      <div
        className="relative bg-white shadow-xl border rounded"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "transform 0.3s ease-in-out",
          margin: "2rem 0",
        }}
      >
        <EditorCanvas width={width} height={height} />
      </div>
    </div>
  );
}
