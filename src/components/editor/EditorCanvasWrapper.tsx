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
  const clearElements = useEditorStore((s) => s.clearElements); // optional: zum Zurücksetzen der Texte

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

    // Initial-Fallback bei kleinem Bildschirm
    const initialWidth = container.offsetWidth;
    if (initialWidth < width + 40) {
      const fallbackScale = initialWidth / (width + 40);
      setScale(fallbackScale);
    }

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

  // 🔄 Zurücksetzen
  const handleReset = () => {
    localStorage.removeItem("editor-format");
    setFormat("a4");
    clearElements(); // Optional: leert den Editor-Inhalt
    window.location.reload(); // Canvas und Größenberechnung komplett neu laden
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 🔘 Reset-Button */}
      <button
        onClick={handleReset}
        className="text-xs text-gray-500 underline mt-4 mb-2"
      >
        Editor zurücksetzen
      </button>

      {/* 🖼 Editor-Wrapper */}
      <div
        ref={wrapperRef}
        className="w-screen max-w-full flex justify-center overflow-x-auto px-2"
      >
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
    </div>
  );
}
