import { useEffect } from "react";
import { useRouter } from "next/router";
import EditorCanvas from "./EditorCanvas";
import EditorHeader from "./EditorHeader";
import { useEditorFormatStore } from "./useEditorFormat";
import { useEditorStore } from "./useEditorStore";

// 📦 Dokument laden
async function loadEditorDocument(id: string, isShared = false) {
  const res = await fetch(`/api/editor/load?id=${id}&shared=${isShared}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Fehler beim Laden");
  return (await res.json()).document;
}

/**
 * Wrapper zeigt Editor‑Canvas (interaktiv) und denselben Canvas im #print-area.
 * Für die Druckansicht wird `printMode` an EditorCanvas übergeben, damit
 * keine UI‑Elemente (Input, Transformer) gerendert werden und autoScale = 1 bleibt.
 * Wir drucken in 96 dpi, um lange Renderzeiten zu vermeiden.
 */
export default function EditorCanvasWrapper() {
  /* ------------------------- Stores / Router ------------------------- */
  const format      = useEditorFormatStore((s) => s.format);
  const setFormat   = useEditorFormatStore((s) => s.setFormat);
  const setElements = useEditorStore((s) => s.setElements);
  const router      = useRouter();

  /* ---------------------- Dokument bei Load --------------------------- */
  useEffect(() => {
    const docId    = router.query.id as string | undefined;
    const isShared = router.query.shared === "true";
    if (!docId) return;

    loadEditorDocument(docId, isShared)
      .then((doc) => {
        if (doc.format) {
          const lower = doc.format.toLowerCase();
          setFormat(lower);
          localStorage.setItem("editor-format", lower);
        }
        if (doc.content) setElements(doc.content);
      })
      .catch((err) => console.error("Ladefehler", err));
  }, [router.query.id, setFormat, setElements]);

  /* -------------------------- Maße 96 dpi ----------------------------- */
  const sizes = {
    a4: { width: 794, height: 1123 },
    a5: { width: 561, height: 794  },
    a6: { width: 398, height: 561  },
  } as const;
  const { width, height } = sizes[format as keyof typeof sizes] || sizes.a4;

  /* ----------------------------- JSX --------------------------------- */
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 overflow-hidden">
      <EditorHeader />

      {/* 👁️ Editor‑Canvas (interaktiv) */}
      <div className="editor-visible w-full flex justify-center px-2 py-6 overflow-auto">
        <div
          className="border border-gray-300 rounded shadow bg-white"
          style={{
            width,
            height,
            transform: `scale(${Math.min(1, window.innerWidth / (width + 40))})`,
            transformOrigin: "top center",
          }}
        >
          <EditorCanvas width={width} height={height} />
        </div>
      </div>

      {/* 🖨️ Print‑Canvas (statisch, keine UI) */}
      {format === "a4" && (
        <div id="print-area" className="print-a4 hidden print:block">
          <EditorCanvas width={width} height={height} printMode />
        </div>
      )}

      {format === "a5" && (
        <div id="print-area" className="print-a5-double hidden print:flex print:flex-col">
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                width,
                height,
                transform: "rotate(90deg)",
                transformOrigin: "top left",
              }}
            >
              <EditorCanvas width={width} height={height} printMode />
            </div>
          ))}
        </div>
      )}

      {format === "a6" && (
        <div id="print-area" className="print-a6-quad hidden print:grid print:grid-cols-2 print:grid-rows-2">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} style={{ width, height }}>
              <EditorCanvas width={width} height={height} printMode />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
