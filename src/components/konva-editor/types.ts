export type EditorElementType = "text" | "qr";

export interface EditorElement {
  id: string;
  type: EditorElementType;
  x: number;
  y: number;
  text?: string;
}
