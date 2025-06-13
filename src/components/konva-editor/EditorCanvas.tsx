import { Stage, Layer, Text, Transformer } from "react-konva";
import { useEditorStore } from "./useEditorStore";
import { useState, useRef, useEffect } from "react";

export default function EditorCanvas() {
  if (typeof window === "undefined") return null;

  const { elements, updateElement } = useEditorStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const transformerRef = useRef<any>(null);
  const selectedShapeRef = useRef<any>(null);

  const editingElement = elements.find((el) => el.id === editingId);

  useEffect(() => {
    if (editingElement && inputRef.current) {
      const input = inputRef.current;
      input.style.position = "absolute";
      input.style.top = `${editingElement.y + 100}px`;
      input.style.left = `${editingElement.x + 16}px`;
      input.style.fontSize = \`\${editingElement.fontSize || 18}px\`;
      input.focus();
    }
  }, [editingElement]);

  useEffect(() => {
    if (transformerRef.current && selectedShapeRef.current) {
      transformerRef.current.nodes([selectedShapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [editingId]);

  const handleEditStart = (elId: string, currentText: string) => {
    setEditingId(elId);
    setEditText(currentText);
  };

  return (
    <div className="relative border border-gray-300 rounded shadow p-4">
      {editingElement && (
        <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
          <label>Größe:</label>
          <input
            type="number"
            value={editingElement.fontSize || 18}
            onChange={(e) =>
              updateElement(editingElement.id, { fontSize: parseInt(e.target.value) })
            }
            className="border rounded px-2 py-1 w-16"
          />

          <label>Schrift:</label>
          <select
            value={editingElement.fontFamily || "Arial"}
            onChange={(e) =>
              updateElement(editingElement.id, { fontFamily: e.target.value })
            }
            className="border rounded px-2 py-1"
          >
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>

          <label>Farbe:</label>
          <input
            type="color"
            value={editingElement.fill || "#000000"}
            onChange={(e) =>
              updateElement(editingElement.id, { fill: e.target.value })
            }
          />

          <button
            onClick={() =>
              updateElement(editingElement.id, {
                fontWeight: editingElement.fontWeight === "bold" ? "normal" : "bold",
              })
            }
            className="border px-2 py-1 rounded font-bold"
          >
            B
          </button>

          <button
            onClick={() =>
              updateElement(editingElement.id, {
                fontStyle: editingElement.fontStyle === "italic" ? "normal" : "italic",
              })
            }
            className="border px-2 py-1 rounded italic"
          >
            I
          </button>

          <label>Ausrichtung:</label>
          <select
            value={editingElement.align || "left"}
            onChange={(e) =>
              updateElement(editingElement.id, { align: e.target.value as any })
            }
            className="border rounded px-2 py-1"
          >
            <option value="left">Links</option>
            <option value="center">Zentriert</option>
            <option value="right">Rechts</option>
          </select>
        </div>
      )}

      <Stage width={600} height={400}>
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
                onDragEnd={(e) =>
                  updateElement(el.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  })
                }
                onDblClick={() => handleEditStart(el.id, el.text || "")}
                onTap={() => handleEditStart(el.id, el.text || "")}
                ref={el.id === editingId ? selectedShapeRef : undefined}
              />
            ) : null
          )}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>

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
