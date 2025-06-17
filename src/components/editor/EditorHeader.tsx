// src/components/editor/EditorHeader.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import {
  HiOutlineFolderOpen,
  HiOutlinePrinter,
  HiOutlinePhotograph,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useEditorStore } from "./useEditorStore";
import { useEditorFormatStore } from "./useEditorFormat";
import ToolbarSaveAsButton from "./toolbar/ToolbarSaveAsButton";
import ToolbarGroupFormat from "./toolbar/ToolbarGroupFormat";
import ToolbarGroupText from "./toolbar/ToolbarGroupText";
import ToolbarGroupInsert from "./toolbar/ToolbarGroupInsert";
import DocumentExplorerOverlay from "./DocumentExplorerOverlay";
import ImageInsertOverlay from "./toolbar/ImageInsertOverlay";

export default function EditorHeader() {
  const router = useRouter();

  // State für Overlays
  const [openExplorer, setOpenExplorer] = useState(false);
  const [openImageInsert, setOpenImageInsert] = useState(false);

  // Editor- und Format-Store
  const elements = useEditorStore((s) => s.elements);
  const clearElements = useEditorStore((s) => s.clearElements);
  const format = useEditorFormatStore((s) => s.format);
  const setFormat = useEditorFormatStore((s) => s.setFormat);

  // Datei öffnen
  const handleSelectDocument = (docId: string) => {
    setOpenExplorer(false);
    router.push(`/editor?id=${docId}`);
  };

  // Drucken
  const handlePrint = () => {
    window.print();
  };

  // Bild einfügen
  const handleInsertImage = (file: File) => {
    // TODO: Hier deine Logik zum Einfügen eines Bildes in den Editor
    // z.B. editorStore.addImage({ file, ... })
    setOpenImageInsert(false);
  };

  // Editor zurücksetzen
  const handleReset = () => {
    localStorage.removeItem("editor-format");
    setFormat("a4");
    clearElements();
    window.location.reload();
  };

  return (
    <>
      <div className="sticky top-0 z-30 w-full bg-white border-b shadow-sm px-4 py-2 flex flex-wrap items-center gap-4">
        {/* — Datei-Aktionen */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenExplorer(true)}
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

        {/* — Bild einfügen */}
        <button
          onClick={() => setOpenImageInsert(true)}
          title="Bild einfügen"
          className="p-2 hover:bg-gray-100 rounded"
        >
          <HiOutlinePhotograph size={20} />
        </button>

        {/* — Format-Auswahl (A4/A5/A6) */}
        <ToolbarGroupFormat />

        {/* — Text-Werkzeuge (Font-Family, Font-Size, Farbe) */}
        <ToolbarGroupText />

        {/* — Einfüge-Werkzeuge (Formen, Icons etc.) */}
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

      {/* Overlays */}
      <DocumentExplorerOverlay
        isOpen={openExplorer}
        onClose={() => setOpenExplorer(false)}
        onSelect={handleSelectDocument}
      />

      <ImageInsertOverlay
        isOpen={openImageInsert}
        onClose={() => setOpenImageInsert(false)}
        onSelect={handleInsertImage}
      />
    </>
  );
}
