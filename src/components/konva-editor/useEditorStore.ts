import { create } from "zustand";

export type EditorElement = {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: "normal" | "italic";
  fontWeight?: "normal" | "bold";
  fill?: string;
  align?: "left" | "center" | "right";
};

type State = {
  elements: EditorElement[];
  addElement: (el: EditorElement) => void;
  updateElement: (id: string, newProps: Partial<EditorElement>) => void;
  addText: () => void; // ✅ hinzufügen
};

export const useEditorStore = create<State>((set) => ({
  elements: [
    {
      id: "1",
      type: "text",
      text: "Hier kannst du Texte bearbeiten",
      x: 50,
      y: 60,
      fontSize: 18,
      fontFamily: "Arial",
      fontStyle: "normal",
      fontWeight: "normal",
      fill: "#000000",
      align: "left",
    },
  ],
  addElement: (el) =>
    set((state) => ({ elements: [...state.elements, el] })),
  updateElement: (id, newProps) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...newProps } : el
      ),
    })),
}));
