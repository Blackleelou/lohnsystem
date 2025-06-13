import { Stage, Layer, Text, Rect, Group } from "react-konva";
import { useEditorStore } from "./useEditorStore";
import { useState, useRef } from "react";
import EditorToolbar from "./EditorToolbar";

type Props = {
  width: number;
  height: number;
};

export default function EditorCanvas({ width, height }: Props) {
  const { elements, updateElement } = useEditorStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<any>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    updateElement(id, { selected: true });
  };

  const handleDeselect = () => {
    setSelectedId(null);
    elements.forEach((el) => updateElement(el.id, { selected: false }));
  };

  return (
    <div className="relative bg-gray-200 flex justify-center items-start overflow-auto px-4 py-8 w-full h-full">
      <div
        style={{
          width,
          height,
          background: "white",
          borderRadius: "4px",
          boxShadow: "0 0 8px rgba(0,0,0,0.2)",
        }}
      >
        <Stage
          width={width}
          height={height}
          ref={stageRef}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) {
              handleDeselect();
            }
          }}
        >
          <Layer clip={{ x: 0, y: 0, width, height }}>
            {/* 🟡 Druckbereich-Markierung */}
            <Group>
              <Rect
                x={40}
                y={40}
                width={width - 80}
                height={height - 80}
                stroke="rgba(0,0,0,0.1)"
                dash={[4, 4]}
              />
            </Group>

            {/* 🔤 Text-Elemente */}
            {elements.map((el) =>
              el.type === "text" ? (
                <Text
                  key={el.id}
                  text={el.text}
                  x={el.x}
                  y={el.y}
                  fontSize={el.fontSize}
                  fontFamily={el.fontFamily}
                  fontStyle={el.fontStyle}
                  fontWeight={el.fontWeight}
                  fill={el.fill}
                  align={el.align}
                  draggable
                  dragBoundFunc={(pos) => {
                    const padding = 10;
                    return {
                      x: Math.max(padding, Math.min(pos.x, width - 100)),
                      y: Math.max(padding, Math.min(pos.y, height - 30)),
                    };
                  }}
                  onClick={() => handleSelect(el.id)}
                  onTap={() => handleSelect(el.id)}
                  onDragEnd={(e) => {
                    updateElement(el.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  }}
                  onDblClick={() => {
                    const newText = prompt("Text ändern:", el.text);
                    if (newText !== null) {
                      updateElement(el.id, { text: newText });
                    }
                  }}
                />
              ) : null
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
