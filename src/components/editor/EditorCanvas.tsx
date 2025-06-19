import {
  Stage,
  Layer,
  Text,
  Transformer,
  Image as KonvaImage,
} from "react-konva";
import { useEditorStore } from "./useEditorStore";
import { useEffect, useRef, useState } from "react";
import useImage from "use-image";

// 🧠 Props für Zeichenfläche
type Props = {
  width: number;
  height: number;
};

export default function EditorCanvas({ width, height }: Props) {
  const { elements, updateElement } = useEditorStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const transformerRef = useRef<any>(null);
  const selectedShapeRef = useRef<any>(null);
  const autoHandledIds = useRef<Set<string>>(new Set());

  const editingElement = elements.find((el) => el.id === editingId);
  const selectedElement = elements.find((el) => el.selected);
  const scale = Math.min(1, window.innerWidth / (width + 40));

  // ✅ Leeres Textelement automatisch auswählen
  useEffect(() => {
    const empty = elements.find(
      (el) =>
        el.type === "text" &&
        (el.text ?? "") === "" &&
        !autoHandledIds.current.has(el.id)
    );

    if (empty) {
      elements.forEach((el) =>
        updateElement(el.id, { selected: el.id === empty.id })
      );
      setEditingId(empty.id);
      setEditText("");
      autoHandledIds.current.add(empty.id);
    }
  }, [elements, updateElement]);

  // ✅ Positionierung des Text-Inputs
  useEffect(() => {
    if (editingElement && inputRef.current) {
      const input = inputRef.current;
      input.style.position = "absolute";
      input.style.top = `${editingElement.y * scale + 100}px`;
      input.style.left = `${editingElement.x * scale + 16}px`;
      input.style.fontSize = `${(editingElement.fontSize || 18) * scale}px`;
      input.style.transform = `scale(${1 / scale})`;
      input.style.transformOrigin = "top left";
      input.focus();
    }
  }, [editingElement, scale]);

  // ✅ Transformer mit selektiertem Element verbinden
  useEffect(() => {
    if (transformerRef.current && selectedShapeRef.current) {
      transformerRef.current.nodes([selectedShapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedElement]);

  // ✅ Transformer und Textfeld vor dem Drucken deaktivieren
  useEffect(() => {
    const handleBeforePrint = () => {
      setEditingId(null); // Textfeld schließen
      transformerRef.current?.nodes([]); // Transformer deaktivieren
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    return () => window.removeEventListener("beforeprint", handleBeforePrint);
  }, []);

  const handleSelect = (id: string) => {
    elements.forEach((el) => updateElement(el.id, { selected: el.id === id }));
  };

  const handleEditStart = (elId: string, currentText: string) => {
    setEditingId(elId);
    setEditText(currentText);
  };

  return (
    <div className="relative border border-gray-300 rounded shadow bg-white flex justify-center">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width,
          height,
        }}
      >
        <Stage width={width} height={height}>
          <Layer clip={{ x: 0, y: 0, width, height }}>
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
                  ref={el.selected ? selectedShapeRef : undefined}
                  onClick={() => handleSelect(el.id)}
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
                />
              ) : el.type === "image" ? (
                <URLImage
                  key={el.id}
                  id={el.id}
                  src={el.src}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
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
          placeholder="Neuen Text eingeben…"
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

function URLImage({
  id,
  src,
  x,
  y,
  width = 200,
  height = 150,
}: {
  id: string;
  src?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}): JSX.Element {
  const [image] = useImage(src || "");
  const updateElement = useEditorStore((s) => s.updateElement);

  return (
    <KonvaImage
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      draggable
      onDragEnd={(e) =>
        updateElement(id, { x: e.target.x(), y: e.target.y() })
      }
    />
  );
}
