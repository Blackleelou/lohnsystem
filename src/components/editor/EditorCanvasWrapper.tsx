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

  const data = await res.json();
  return data.document;
}

export default function EditorCanvasWrapper() {
  const format = useEditorFormatStore((s) => s.format);
  const setFormat = useEditorFormatStore((s) => s.setFormat);
  const setElements = useEditorStore((s) => s.setElements);
  const router = useRouter();

  useEffect(() => {
    const docId = router.query.id as string | undefined;
    const isShared = router.query.shared === "true";

    if (docId) {
      loadEditorDocument(docId, isShared)
        .then((doc) => {
          if (doc.format) {
            const lowerFormat = doc.format.toLowerCase();
            setFormat(lowerFormat);
            localStorage.setItem("editor-format", lowerFormat);
          }
          if (doc.content) {
            setElements(doc.content);
          }
        })
        .catch((err) => {
          console.error("Ladefehler", err);
        });
    }
  }, [router.query.id, setFormat, setElements]);

  useEffect(() => {
    localStorage.setItem("editor-format", format);
  }, [format]);

  // 🧮 Exakte Größen (96 dpi → px)
  const sizes = {
    a4: { width: 794, height: 1123 },
    a5: { width: 561, height: 794 },
    a6: { width: 398, height: 561 },
  };

  const { width, height } = sizes[format as keyof typeof sizes] || sizes.a4;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 overflow-hidden">
      <EditorHeader />

      {/* 👁️ Sichtbare Bearbeitungsfläche */}
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

      {/* 🖨️ Unsichtbarer Druckbereich */}
      {format === "a4" && (
        <div id="print-area" className="hidden print:block">
          <EditorCanvas width={794} height={1123} />
        </div>
      )}

      {format === "a5" && (
        <div id="print-area" className="print-a5-double hidden print:flex print:flex-col">
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 561,
                height: 794,
                transform: "rotate(90deg)",
                transformOrigin: "top left",
              }}
            >
              <EditorCanvas width={561} height={794} />
            </div>
          ))}
        </div>
      )}

      {format === "a6" && (
        <div
          id="print-area"
          className="print-a6-quad hidden print:grid print:grid-cols-2 print:grid-rows-2"
        >
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} style={{ width: 398, height: 561 }}>
              <EditorCanvas width={398} height={561} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
