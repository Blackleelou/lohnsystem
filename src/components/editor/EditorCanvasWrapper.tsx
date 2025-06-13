// src/components/editor/EditorCanvasWrapper.tsx

import EditorCanvas from "./EditorCanvas";
import { useCanvasSize } from "./useCanvasSize";

export default function EditorCanvasWrapper() {
  const { width, height } = useCanvasSize();

  // Automatische Skalierung bei kleinen Bildschirmen
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
