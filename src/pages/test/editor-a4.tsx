import dynamic from "next/dynamic";

// Nur im Browser laden
const EditorCanvasWrapper = dynamic(() => import("@/components/editor/EditorCanvasWrapper"), {
  ssr: false,
});

export default function EditorTestPage() {
  return <EditorCanvasWrapper />;
}
