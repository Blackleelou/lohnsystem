// src/components/editor/useEditorFormat.ts

import { create } from "zustand";

type EditorFormat = "a4" | "a5" | "a6" | "letter";

type EditorFormatStore = {
  // bereits vorhanden
  format: EditorFormat;
  setFormat: (f: EditorFormat) => void;

  // neu: Text-Formatierung
  fontFamily: string;
  setFontFamily: (f: string) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  fontColor: string;
  setFontColor: (c: string) => void;
};

export const useEditorFormatStore = create<EditorFormatStore>((set) => ({
  // Seite
  format: "a4",
  setFormat: (format) => set({ format }),

  // Text
  fontFamily: "Arial",
  setFontFamily: (fontFamily) => set({ fontFamily }),
  fontSize: 14,
  setFontSize: (fontSize) => set({ fontSize }),
  fontColor: "#000000",
  setFontColor: (fontColor) => set({ fontColor }),
}));
