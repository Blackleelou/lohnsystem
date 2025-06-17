// src/components/editor/useEditorStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EditorElement = {
  id: string;
  type: "text" | "image";
  text?: string;
  x: number;
  y: number;
  src?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: "normal" | "italic";
  fontWeight?: "normal" | "bold";
  fill?: string;
  align?: "left" | "center" | "right";
  selected?: boolean;
};

type State = {
  elements: EditorElement[];
  addElement: (el: EditorElement) => void;
  updateElement: (id: string, newProps: Partial<EditorElement>) => void;
  addText: () => void;
  clearElements: () => void;
  setElements: (elements: EditorElement[]) => void;
};

export const useEditorStore = create<State>()(
  persist(
    (set, get) => ({
      // ✏️ jetzt komplett leer
      elements: [],

      addElement: (el) => set({ elements: [...get().elements, el] }),
      updateElement: (id, newProps) =>
        set({
          elements: get().elements.map((el) =>
            el.id === id ? { ...el, ...newProps } : el
          ),
        }),

      addText: () =>
        set({
          elements: [
            ...get().elements,
            {
              id: (get().elements.length + 1).toString(),
              type: "text",
              // ✏️ leerer Start-Text
              text: "",
              x: 100,
              y: 100,
              fontSize: 18,
              fontFamily: "Arial",
              fontStyle: "normal",
              fontWeight: "normal",
              fill: "#000000",
              align: "left",
              selected: false,
            },
          ],
        }),

      clearElements: () => set({ elements: [] }),
      setElements: (elements) => set({ elements }),
    }),
    {
      name: "editor-elements",
      getStorage: () => localStorage,
      partialize: (state) => ({ elements: state.elements }),
    }
  )
);
