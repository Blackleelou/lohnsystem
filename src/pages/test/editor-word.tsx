import dynamic from "next/dynamic";

const EditorCanvas = dynamic(() => import("@/components/konva-editor/EditorCanvas"), {
  ssr: false, // verhindert Server-Rendering
});

const Toolbar = dynamic(() => import("@/components/konva-editor/Toolbar"), {
  ssr: false,
});

export default function WordEditorTestPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modularer Word-Editor (Test)</h1>
      <Toolbar />
      <EditorCanvas />
    </div>
  );
}
