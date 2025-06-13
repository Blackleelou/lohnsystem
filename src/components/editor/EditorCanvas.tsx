import { Stage, Layer, Text } from "react-konva";
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
    // Element als ausgewählt markieren
    updateElement(id, { selected: true });
  };

  const handleDeselect = () => {
    setSelectedId(null);
    elements.forEach((el) => updateElement(el.id, { selected: false }));
  };

  return (
    <div className="relative">
      <Stage
        width={width}
        height={height}
        ref={stageRef}
        className="bg-white"
        onMouseDown={(e) => {
          // Klicken außerhalb von Text => abwählen
          if (e.target === e.target.getStage()) {
            handleDeselect();
          }
        }}
      >
        <Layer>
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
  );
}
