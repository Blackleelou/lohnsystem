// src/components/editor/EditorHeader.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import {
  HiOutlinePrinter,
  HiOutlinePhotograph,
  HiOutlineDocumentText,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useEditorStore } from "./useEditorStore";
import { useEditorFormatStore } from "./useEditorFormat";
import ToolbarSaveAsButton from "./toolbar/ToolbarSaveAsButton";
import ToolbarGroupFormat from "./toolbar/ToolbarGroupFormat";
import ToolbarGroupText from "./toolbar/ToolbarGroupText";
import { v4 as uuid } from "uuid";

export default function EditorHeader() {
  const router = useRouter();

  // Store-Hooks
  const clearElements = useEditorStore((s) => s.clearElements);
  const addElement = useEditorStore((s) => s.addElement);
  const setFormat = useEditorFormatStore((s) => s.setFormat);

  // 1) Drucken
  const handlePrint = () => window.print();

  // 2) Bild einfügen
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

  // 3) Text einfügen (jetzt ohne vorgegebenen Text)
  const handleInsertText = () => {
    addElement({
      id: uuid(),
      type: "text",
      text: "",          // leer starten
      x: 50,
      y: 50,
      fontSize: 18,
      fontFamily: "Arial",
      fontStyle: "normal",
      fontWeight: "normal",
      fill: "#000000",
      align: "left",
      selected: false,
    });
  };

  // 4) Editor zurücksetzen
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
      <label
        htmlFor="header-image-upload"
        className="cursor-pointer p-2 hover:bg-gray-100 rounded"
        title="Bild einfügen"
      >
        <HiOutlinePhotograph size={20} />
        <input
          id="header-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>

      {/* — Text einfügen */}
      <button
        onClick={handleInsertText}
        title="Text einfügen"
        className="p-2 hover:bg-gray-100 rounded"
      >
        <HiOutlineDocumentText size={20} />
      </button>

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
  );
}
