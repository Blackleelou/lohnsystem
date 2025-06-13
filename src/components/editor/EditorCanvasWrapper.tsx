import { useEffect, useRef, useState } from "react";
import EditorCanvas from "./EditorCanvas";
import { useCanvasSize } from "./useCanvasSize";
import { useEditorFormatStore } from "./useEditorFormat";
import { useEditorStore } from "./useEditorStore";

export default function EditorCanvasWrapper() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

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

  // 📏 Dynamisches Scaling
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const padding = 32;
      const newScale = containerWidth < width + padding
        ? containerWidth / (width + padding)
        : 1;
      setScale(newScale);
    };

    resize();

    const observer = new ResizeObserver(resize);
    if (containerRef.current) observer.observe(containerRef.current);

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
      <button
        onClick={handleReset}
        className="text-xs text-gray-500 underline mt-4 mb-2"
      >
        Editor zurücksetzen
      </button>

      <div
        ref={containerRef}
        className="w-full max-w-full flex justify-center overflow-x-auto px-2"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: `${width}px`,
            height: `${height}px`,
            margin: "2rem 0",
          }}
        >
          <EditorCanvas width={width} height={height} />
        </div>
      </div>
    </div>
  );
}
