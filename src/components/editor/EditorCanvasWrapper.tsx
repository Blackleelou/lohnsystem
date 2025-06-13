// src/components/editor/EditorCanvasWrapper.tsx

import EditorCanvas from "./EditorCanvas";
import { useCanvasSize } from "./useCanvasSize";

export default function EditorCanvasWrapper() {
  const { width, height } = useCanvasSize();

  return (
    <div className="overflow-auto w-full flex justify-center">
      <div
        className="bg-white shadow-xl border rounded relative"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          margin: "2rem 0",
        }}
      >
        <EditorCanvas width={width} height={height} />
      </div>
    </div>
  );
}
