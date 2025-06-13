// src/components/editor/useEditorFormat.ts

import { create } from "zustand";

type EditorFormat = "a4" | "letter";

type EditorFormatStore = {
  format: EditorFormat;
  setFormat: (f: EditorFormat) => void;
};

export const useEditorFormatStore = create<EditorFormatStore>((set) => ({
  format: "a4",
  setFormat: (format) => set({ format }),
}));
