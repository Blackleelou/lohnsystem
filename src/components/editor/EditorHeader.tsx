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
import DocumentExplorerOverlay from "./DocumentExplorerOverlay";
import { v4 as uuid } from "uuid";

export default function EditorHeader() {
  const router = useRouter();
  const [openExplorer, setOpenExplorer] = useState(false);

  const elements = useEditorStore((s) => s.elements);
  const clearElements = useEditorStore((s) => s.clearElements);
  const addElement = useEditorStore((s) => s.addElement);
  const format = useEditorFormatStore((s) => s.format);
  const setFormat = useEditorFormatStore((s) => s.setFormat);

  // 1) Dokument öffnen
  const handleSelectDocument = (docId: string) => {
    setOpenExplorer(false);
    router.push(`/editor?id=${docId}`);
  };

  // 2) Drucken
  const handlePrint = () => window.print();

  // 3) Bild einfügen (aus alter ToolbarGroupInsert.tsx)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      addElement({
        id: uuid(),
        type: "image",
        src: reader.result as string,
        x: 100,
        y: 100,
        width: 200,
        height: 150,
      });
    };
    reader.readAsDataURL(file);
  };

  // 4) Editor zurücksetzen
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

        {/* — Bild einfügen: nutzen wir direkt den versteckten File-Input */}
        <label
          htmlFor="header-image-upload"
          className="cursor-pointer p-2 hover:bg-gray-100 rounded"
          title="Bild einfügen"
        >
          📷
          <input
            id="header-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {/* — Format-Auswahl (A4/A5/A6) */}
        <ToolbarGroupFormat />

        {/* — Text-Werkzeuge (Font-Family, Font-Size, Farbe) */}
        <ToolbarGroupText />

        {/* — Editor zurücksetzen */}
        <button
          onClick={handleReset}
          title="Editor zurücksetzen"
          className="ml-auto p-2 hover:bg-gray-100 rounded"
        >
          <HiOutlineRefresh size={20} />
        </button>
      </div>

      {/* Overlay für "Öffnen" */}
      <DocumentExplorerOverlay
        isOpen={openExplorer}
        onClose={() => setOpenExplorer(false)}
        onSelect={handleSelectDocument}
      />
    </>
  );
}
