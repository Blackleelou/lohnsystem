// src/components/editor/EditorHeader.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import {
  HiOutlineFolderOpen,
  HiOutlinePrinter,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useEditorStore } from "./useEditorStore";
import { useEditorFormatStore } from "./useEditorFormat";
import ToolbarSaveAsButton from "./toolbar/ToolbarSaveAsButton";
import ToolbarGroupFormat from "./toolbar/ToolbarGroupFormat";
import ToolbarGroupText from "./toolbar/ToolbarGroupText";
import ToolbarGroupInsert from "./toolbar/ToolbarGroupInsert";
import DocumentExplorerOverlay from "./DocumentExplorerOverlay";

export default function EditorHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const elements = useEditorStore((s) => s.elements);
  const clearElements = useEditorStore((s) => s.clearElements);
  const format = useEditorFormatStore((s) => s.format);
  const setFormat = useEditorFormatStore((s) => s.setFormat);

  // 1) Öffnen (Explorer-Overlay)
  const handleSelect = (docId: string) => {
    setOpen(false);
    router.push(`/editor?id=${docId}`);
  };

  // 2) Drucken
  const handlePrint = () => window.print();

  // 3) Reset
  const handleReset = () => {
    localStorage.removeItem("editor-format");
    setFormat("a4");
    clearElements();
    window.location.reload();
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-white border-b shadow-sm px-4 py-2 flex flex-wrap items-center gap-4">
      {/* — Datei-Aktionen */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          title="Öffnen"
          className="p-2 hover:bg-gray-100 rounded"
        >
          <HiOutlineFolderOpen size={20} />
        </button>

        <ToolbarSaveAsButton />

        <button
          onClick={handlePrint}
          title="Drucken"
          className="p-2 hover:bg-gray-100 rounded"
        >
          <HiOutlinePrinter size={20} />
        </button>
      </div>

      {/* Overlay für "Öffnen" */}
      <DocumentExplorerOverlay
        isOpen={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />

      {/* — Format-Auswahl (A4/A5/A6) */}
      <ToolbarGroupFormat />

      {/* — Text-Werkzeuge (Schriftart, Größe, Stil, Farbe, Ausrichtung) */}
      <ToolbarGroupText />

      {/* — Einfüge-Werkzeuge (Formen, Bilder, Icons) */}
      <ToolbarGroupInsert />

      {/* — Editor zurücksetzen */}
      <button
        onClick={handleReset}
        title="Editor zurücksetzen"
        className="ml-auto p-2 hover:bg-gray-100 rounded"
      >
        <HiOutlineRefresh size={20} />
      </button>
    </div>
  );
}
