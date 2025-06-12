import { Stage, Layer, Text } from "react-konva";
import { useEditorStore } from "./useEditorStore";
import { useEffect, useRef } from "react";

export default function EditorCanvas() {
  // 🛡️ Schutz: Nur im Browser rendern
  if (typeof window === "undefined") return null;

  const { elements, updateElement } = useEditorStore();

  return (
    <div className="border border-gray-300 rounded shadow">
      <Stage width={600} height={400}>
        <Layer>
          {elements.map(el =>
            el.type === "text" ? (
              <Text
                key={el.id}
                x={el.x}
                y={el.y}
                text={el.text}
                fontSize={18}
                draggable
                onDragEnd={e =>
                  updateElement(el.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  })
                }
              />
            ) : null
          )}
        </Layer>
      </Stage>
    </div>
  );
}
