import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EditorCanvas from "./EditorCanvas";
import EditorHeader from "./EditorHeader";
import { useCanvasSize } from "./useCanvasSize";
import { useEditorFormatStore } from "./useEditorFormat";
import { useEditorStore } from "./useEditorStore";
import DocumentExplorerOverlay from "./DocumentExplorerOverlay"; // ⬅️ WICHTIG

// 🧠 Dokument von API laden
async function loadEditorDocument(id: string, isShared = false) {
  const res = await fetch("/api/editor/load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, shared: isShared }),
  });

  if (!res.ok) throw new Error("Fehler beim Laden");

  const data = await res.json();
  return data.document;
}

export default function EditorCanvasWrapper() {
  const { width, height } = useCanvasSize();
  const format = useEditorFormatStore((s) => s.format);
  const setFormat = useEditorFormatStore((s) => s.setFormat);
  const clearElements = useEditorStore((s) => s.clearElements);
  const setElements = useEditorStore((s) => s.setElements);
  const router = useRouter();

  const [explorerOpen, setExplorerOpen] = useState(false); // ⬅️ Explorer sichtbar?
  const handleSelectDocument = (docId: string) => {
    router.push(`/editor?id=${docId}`);
  };

  // 📦 Laden bei URL ?id=...
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
  }, [router.query.id]);

  // 🧠 Format aus localStorage laden
  useEffect(() => {
    const saved = localStorage.getItem("editor-format");
    if (saved === "a4" || saved === "a5" || saved === "a6") {
      setFormat(saved);
    }
  }, [setFormat]);

  // 💾 Format im localStorage speichern
  useEffect(() => {
    localStorage.setItem("editor-format", format);
  }, [format]);

  const handleReset = () => {
    localStorage.removeItem("editor-format");
    setFormat("a4");
    clearElements();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 overflow-hidden">
      {/* 🔝 Moderne Toolbar mit Dropdown-Auswahl */}
      <EditorHeader />

      {/* 📂 Dokument öffnen */}
      <button
        onClick={() => setExplorerOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded"
      >
        📂 Dokument öffnen
      </button>

      {/* 🖼 Zeichenfläche */}
      <div className="w-full flex justify-center px-2 py-6 overflow-auto">
        <div
          className="border border-gray-300 rounded shadow bg-white"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${Math.min(1, window.innerWidth / (width + 40))})`,
            transformOrigin: "top center",
          }}
        >
          <EditorCanvas width={width} height={height} />
        </div>
      </div>

      {/* 🧹 Zurücksetzen */}
      <button
        onClick={handleReset}
        className="text-xs text-gray-400 underline mt-4 mb-6"
      >
        Editor zurücksetzen
      </button>

      {/* 🧭 Explorer-Overlay */}
      <DocumentExplorerOverlay
        isOpen={explorerOpen}
        onClose={() => setExplorerOpen(false)}
        onSelect={handleSelectDocument}
      />
    </div>
  );
}
