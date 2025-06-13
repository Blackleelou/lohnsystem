import { Stage, Layer, Text, Transformer } from "react-konva";
import { useEditorStore } from "./useEditorStore";
import { useState, useRef, useEffect } from "react";
import EditorToolbar from "./EditorToolbar";

type Props = {
  width: number;
  height: number;
};

export default function EditorCanvas({ width, height }: Props) {
  if (typeof window === "undefined") return null;

  const { elements, updateElement } = useEditorStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const transformerRef = useRef<any>(null);
  const selectedShapeRef = useRef<any>(null);

  const editingElement = elements.find((el) => el.id === editingId);
  const selectedElement = elements.find((el) => el.selected);

  useEffect(() => {
    if (editingElement && inputRef.current) {
      const input = inputRef.current;
      input.style.position = "absolute";
      input.style.top = `${editingElement.y + 100}px`;
      input.style.left = `${editingElement.x + 16}px`;
      input.style.fontSize = `${editingElement.fontSize || 18}px`;
      input.focus();
    }
  }, [editingElement]);

  useEffect(() => {
    if (transformerRef.current && selectedShapeRef.current) {
      transformerRef.current.nodes([selectedShapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedElement]);

  const handleSelect = (id: string) => {
    elements.forEach((el) => {
      updateElement(el.id, { selected: el.id === id });
    });
  };

  const handleEditStart = (elId: string, currentText: string) => {
    setEditingId(elId);
    setEditText(currentText);
  };

  return (
    <div className="relative border border-gray-300 rounded shadow p-4">
      {selectedElement && <EditorToolbar />}

      <div className="overflow-auto border bg-white shadow-inner mx-auto" style={{ width, height }}>
        <Stage width={width} height={height}>
          <Layer>
            {elements.map((el) =>
              el.type === "text" ? (
                <Text
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  text={el.text}
                  fontSize={el.fontSize || 18}
                  fontFamily={el.fontFamily || "Arial"}
                  fontStyle={el.fontStyle || "normal"}
                  fontWeight={el.fontWeight || "normal"}
                  fill={el.fill || "#000000"}
                  align={el.align || "left"}
                  draggable
                  onClick={() => {
                    handleSelect(el.id);
                  }}
                  onDblClick={() => {
                    handleSelect(el.id);
                    handleEditStart(el.id, el.text || "");
                  }}
                  onTap={() => {
                    handleSelect(el.id);
                    handleEditStart(el.id, el.text || "");
                  }}
                  onDragEnd={(e) =>
                    updateElement(el.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    })
                  }
                  ref={el.selected ? selectedShapeRef : undefined}
                />
              ) : null
            )}
            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </div>

      {editingElement && (
        <input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={() => {
            updateElement(editingElement.id, { text: editText });
            setEditingId(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateElement(editingElement.id, { text: editText });
              setEditingId(null);
            }
          }}
          className="absolute border border-gray-300 rounded px-1 py-0.5 bg-white"
          style={{ zIndex: 10 }}
        />
      )}
    </div>
  );
}
