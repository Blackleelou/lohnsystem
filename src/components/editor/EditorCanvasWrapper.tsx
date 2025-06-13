import { useEffect, useRef, useState } from "react";
import EditorCanvas from "./EditorCanvas";
import { useCanvasSize } from "./useCanvasSize";
import { useEditorFormatStore } from "./useEditorFormat";
import { useEditorStore } from "./useEditorStore";

export default function EditorCanvasWrapper() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const { width, height } = useCanvasSize();
  const format = useEditorFormatStore((s) => s.format);
  const setFormat = useEditorFormatStore((s) => s.setFormat);
  const clearElements = useEditorStore((s) => s.clearElements);

  // 1. Format aus localStorage holen
  useEffect(() => {
    const saved = localStorage.getItem("editor-format");
    if (saved === "a4" || saved === "a5" || saved === "a6") {
      setFormat(saved);
    }
  }, [setFormat]);

  // 2. Format speichern
  useEffect(() => {
    localStorage.setItem("editor-format", format);
  }, [format]);

  // 3. Skalierung berechnen mit ResizeObserver
  useEffect(() => {
    const container = wrapperRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        const padding = 32; // z. B. px-4 links/rechts
        const newScale =
          containerWidth < width + padding
            ? containerWidth / (width + padding)
            : 1;
        setScale(newScale);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [width]);

  const handleReset = () => {
    localStorage.removeItem("editor-format");
    setFormat("a4");
    clearElements();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Reset-Button */}
      <button
        onClick={handleReset}
        className="text-xs text-gray-500 underline mt-4 mb-2"
      >
        Editor zurücksetzen
      </button>

      {/* Canvas-Container mit Skalierung */}
      <div
        ref={wrapperRef}
        className="w-full max-w-full flex justify-center overflow-x-auto px-4"
      >
        <div
          className="bg-white shadow-xl border rounded relative"
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
    </div>
  );
}
