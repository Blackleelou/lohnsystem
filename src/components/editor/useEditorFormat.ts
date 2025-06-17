// src/components/editor/useEditorFormat.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

type EditorFormat = "a4" | "a5" | "a6" | "letter";

type EditorFormatStore = {
  format: EditorFormat;
  setFormat: (f: EditorFormat) => void;
  fontFamily: string;
  setFontFamily: (f: string) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  fontColor: string;
  setFontColor: (c: string) => void;
};

export const useEditorFormatStore = create<EditorFormatStore>()(
  persist(
    (set) => ({
      format: "a4",
      setFormat: (format) => set({ format }),

      fontFamily: "Arial",
      setFontFamily: (fontFamily) => set({ fontFamily }),
      fontSize: 14,
      setFontSize: (fontSize) => set({ fontSize }),
      fontColor: "#000000",
      setFontColor: (fontColor) => set({ fontColor }),
    }),
    {
      name: "editor-format",             // key im localStorage
      getStorage: () => localStorage,
      partialize: (state) => ({           // nur diese Felder speichern
        format: state.format,
        fontFamily: state.fontFamily,
        fontSize: state.fontSize,
        fontColor: state.fontColor,
      }),
    }
  )
);
