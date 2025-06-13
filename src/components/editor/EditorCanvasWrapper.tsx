// src/components/editor/EditorCanvasWrapper.tsx

import { useCanvasSize } from "./useCanvasSize";
import EditorCanvas from "./EditorCanvas";

export default function EditorCanvasWrapper() {
  const { width, height } = useCanvasSize();

  return (
    <div className="flex justify-center overflow-auto">
      <div
        style={{
          width,
          height,
          background: "white",
          boxShadow: "0 0 4px rgba(0,0,0,0.2)",
        }}
      >
        <EditorCanvas />
      </div>
    </div>
  );
}
