import { useEffect, useRef, useState } from "react";
import EditorCanvas from "./EditorCanvas";
import { useCanvasSize } from "./useCanvasSize";
import { useEditorFormatStore } from "./useEditorFormat";

export default function EditorCanvasWrapper() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
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

  // 📏 ResizeObserver zur dynamischen Skalierung
  useEffect(() => {
    const container = wrapperRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        const newScale = containerWidth < width + 40 ? containerWidth / (width + 40) : 1;
        setScale(newScale);
      }
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={wrapperRef} className="w-full flex justify-center overflow-auto px-2">
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
