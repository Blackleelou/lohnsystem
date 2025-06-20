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

interface Props {
  width: number;
  height: number;
  /** Druckmodus blendet UI aus & verhindert Auto-Scale */
  printMode?: boolean;
}

export default function EditorCanvas({ width, height, printMode = false }: Props) {
  /* ------------------------- Zustand ------------------------- */
  const { elements, updateElement } = useEditorStore();
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editText, setEditText]     = useState("");

  /* -------------------------- Refs --------------------------- */
  const inputRef        = useRef<HTMLInputElement>(null);
  const transformerRef  = useRef<any>(null);
  const selectedShapeRef= useRef<any>(null);
  const autoHandledIds  = useRef<Set<string>>(new Set());

  /* --------------------- Hilfswerte --------------------------- */
  const editingElement  = elements.find((el) => el.id === editingId);
  const selectedElement = elements.find((el) => el.selected);

  // Bildschirm‑Scale nur im Editor, nicht im Druck
  const autoScale = Math.min(1, window.innerWidth / (width + 40));
  const viewScale = printMode ? 1 : autoScale;

  /* ---------------------- Effekte ----------------------------- */
  // Leeres Textelement sofort editierbar
  useEffect(() => {
    const empty = elements.find(
      (el) => el.type === "text" && (el.text ?? "") === "" && !autoHandledIds.current.has(el.id)
    );
    if (empty && !printMode) {
      elements.forEach((el) => updateElement(el.id, { selected: el.id === empty.id }));
      setEditingId(empty.id);
      setEditText("");
      autoHandledIds.current.add(empty.id);
    }
  }, [elements, updateElement, printMode]);

  // Position des Input‑Felds (Editor‑Modus)
  useEffect(() => {
    if (printMode || !editingElement || !inputRef.current) return;
    const n = editingElement;
    const input = inputRef.current;
    input.style.position = "absolute";
    input.style.top      = `${n.y * autoScale + 100}px`;
    input.style.left     = `${n.x * autoScale + 16}px`;
    input.style.fontSize = `${(n.fontSize || 18) * autoScale}px`;
    input.style.transform = `scale(${1 / autoScale})`;
    input.style.transformOrigin = "top left";
    input.focus();
  }, [editingElement, autoScale, printMode]);

  // Transformer an selektierte Node hängen (nur Editor)
  useEffect(() => {
    if (printMode) return;
    if (transformerRef.current && selectedShapeRef.current) {
      transformerRef.current.nodes([selectedShapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedElement, printMode]);

  /* -------------------- Handler ------------------------------- */
  const handleSelect = (id: string) => {
    elements.forEach((el) => updateElement(el.id, { selected: el.id === id }));
  };

  const handleEditStart = (elId: string, currentText: string) => {
    if (printMode) return;
    setEditingId(elId);
    setEditText(currentText);
  };

  // Transform endet → alle Matrix‑Daten speichern
  const handleTransformEnd = (node: any, el: any) => {
    const newData: Record<string, any> = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    };

    if (el.type === "image") {
      // Bildgröße proportional speichern (optional)
      newData.width  = el.width  ?? node.width();
      newData.height = el.height ?? node.height();
    }

    updateElement(el.id, newData);
  };

  /* ------------------------ Render ---------------------------- */
  return (
    <div className="relative border border-gray-300 rounded shadow bg-white flex justify-center">
      <div
        style={{
          transform: `scale(${viewScale})`,
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
                  fill={el.fill || "#000"}
                  align={el.align || "left"}
                  rotation={(el as any).rotation ?? 0}
                  scaleX={(el as any).scaleX ?? 1}
                  scaleY={(el as any).scaleY ?? 1}
                  draggable={!printMode}
                  ref={el.selected ? selectedShapeRef : undefined}
                  onClick={() => handleSelect(el.id)}
                  onDblClick={() => handleEditStart(el.id, el.text || "")}
                  onTap={() => handleEditStart(el.id, el.text || "")}
                  onDragEnd={(e) => updateElement(el.id, { x: e.target.x(), y: e.target.y() })}
                  onTransformEnd={(e) => handleTransformEnd(e.target, el)}
                />
              ) : el.type === "image" ? (
                <URLImage
                  key={el.id}
                  el={el}
                  selectedShapeRef={selectedShapeRef}
                  printMode={printMode}
                  onSelect={handleSelect}
                  onTransformEnd={handleTransformEnd}
                />
              ) : null
            )}
            {!printMode && <Transformer ref={transformerRef} />}
          </Layer>
        </Stage>
      </div>

      {/* Input nur im Editor */}
      {!printMode && editingElement && (
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

/* --------------------------- URLImage --------------------------- */
interface ImgProps {
  el: any;
  selectedShapeRef: any;
  printMode: boolean;
  onSelect: (id: string) => void;
  onTransformEnd: (node: any, el: any) => void;
}

function URLImage({ el, selectedShapeRef, printMode, onSelect, onTransformEnd }: ImgProps): JSX.Element {
  const [image] = useImage(el.src || "");
  const updateElement = useEditorStore((s) => s.updateElement);

  return (
    <KonvaImage
      image={image}
      x={el.x}
      y={el.y}
      width={el.width ?? 200}
      height={el.height ?? 150}
      rotation={(el as any).rotation ?? 0}
      scaleX={(el as any).scaleX ?? 1}
      scaleY={(el as any).scaleY ?? 1}
      draggable={!printMode}
      ref={el.selected ? selectedShapeRef : undefined}
      onClick={() => onSelect(el.id)}
      onTap={() => onSelect(el.id)}
      onDragEnd={(e) => updateElement(el.id, { x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => onTransformEnd(e.target, el)}
    />
  );
}
