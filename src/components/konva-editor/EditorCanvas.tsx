import { Stage, Layer, Text } from "react-konva";
import { useEditorStore } from "./useEditorStore";
import { useState, useRef, useEffect } from "react";

export default function EditorCanvas() {
  if (typeof window === "undefined") return null;

  const { elements, updateElement } = useEditorStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const editingElement = elements.find((el) => el.id === editingId);

  useEffect(() => {
    if (editingElement && inputRef.current) {
      const input = inputRef.current;
      input.style.position = "absolute";
      input.style.top = `${editingElement.y + 100}px`; // ggf. anpassen je nach Layout
      input.style.left = `${editingElement.x + 16}px`;
      input.style.fontSize = "18px";
      input.focus();
    }
  }, [editingElement]);

  const handleEditStart = (elId: string, currentText: string) => {
    setEditingId(elId);
    setEditText(currentText);
  };

  return (
    <div className="relative border border-gray-300 rounded shadow">
      <Stage width={600} height={400}>
        <Layer>
          {elements.map((el) =>
            el.type === "text" ? (
              <Text
                key={el.id}
                x={el.x}
                y={el.y}
                text={el.text}
                fontSize={18}
                draggable
                onDragEnd={(e) =>
                  updateElement(el.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  })
                }
                onDblClick={() => handleEditStart(el.id, el.text || "")} // Desktop
                onTap={() => handleEditStart(el.id, el.text || "")}      // Handy
              />
            ) : null
          )}
        </Layer>
      </Stage>

      {/* Eingabefeld */}
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
          className="absolute border border-gray-300 rounded px-1 py-0.5"
          style={{ zIndex: 10 }}
        />
      )}
    </div>
  );
}
