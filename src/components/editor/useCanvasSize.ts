// src/components/editor/useCanvasSize.ts

import { useEditorFormatStore } from "./useEditorFormat";

export function useCanvasSize() {
  const format = useEditorFormatStore((s) => s.format);

  switch (format) {
    case "a6":
      return { width: 298, height: 420 }; // 105 × 148 mm
    case "a5":
      return { width: 420, height: 595 }; // 148 × 210 mm
    case "a4":
      return { width: 595, height: 842 }; // 210 × 297 mm
    case "letter":
      return { width: 612, height: 792 }; // 8.5 × 11 inch
    default:
      return { width: 595, height: 842 }; // fallback A4
  }
}
