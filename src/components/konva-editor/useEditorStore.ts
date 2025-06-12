// components/konva-editor/useEditorStore.ts
import { create } from "zustand";
import { EditorElement } from "./types";

interface EditorState {
  elements: EditorElement[];
  addText: () => void;
  updateElement: (id: string, newProps: Partial<EditorElement>) => void;
  removeElement: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  elements: [],
  addText: () =>
    set((state) => ({
      elements: [
        ...state.elements,
        {
          id: Date.now().toString(),
          type: "text",
          x: 50,
          y: 50,
          text: "Neuer Text",
        },
      ],
    })),
  updateElement: (id, newProps) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...newProps } : el
      ),
    })),
  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
    })),
}));
