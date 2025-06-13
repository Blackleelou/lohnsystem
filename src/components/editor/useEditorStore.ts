import { create } from "zustand";

export type EditorElement = {
  id: string;
  type: "text" | "image"; // ← erweitert
  text?: string;          // ← optional für Text
  x: number;
  y: number;
  src?: string;           // ← optional für Bild
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
      selected: false,
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
  addText: () =>
    set((state) => {
      const newId = (state.elements.length + 1).toString();
      const newText: EditorElement = {
        id: newId,
        type: "text",
        text: "Neuer Text",
        x: 100,
        y: 100,
        fontSize: 18,
        fontFamily: "Arial",
        fontStyle: "normal",
        fontWeight: "normal",
        fill: "#000000",
        align: "left",
        selected: false,
      };
      return { elements: [...state.elements, newText] };
    }),
  clearElements: () => set({ elements: [] }),
}));
