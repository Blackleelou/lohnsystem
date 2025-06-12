import { useState } from "react";
import { EditorElement } from "./types";

export function useEditorStore() {
  const [elements, setElements] = useState<EditorElement[]>([]);

  const addText = () => {
    setElements(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "text",
        x: 50,
        y: 50,
        text: "Neuer Text",
      },
    ]);
  };

  const updateElement = (id: string, newProps: Partial<EditorElement>) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  const removeElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
  };

  return { elements, addText, updateElement, removeElement };
}
