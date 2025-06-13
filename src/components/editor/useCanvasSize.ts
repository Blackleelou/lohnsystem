// src/components/editor/useCanvasSize.ts

import { useEditorFormatStore } from "./useEditorFormat";

export function useCanvasSize() {
  const format = useEditorFormatStore((s) => s.format);

  switch (format) {
    case "A6":
      return { width: 298, height: 420 }; // 105 × 148 mm
    case "A5":
      return { width: 420, height: 595 }; // 148 × 210 mm
    case "A4":
    default:
      return { width: 595, height: 842 }; // 210 × 297 mm
  }
}
