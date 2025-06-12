import EditorCanvas from "@/components/konva-editor/EditorCanvas";
import Toolbar from "@/components/konva-editor/Toolbar";

export default function WordEditorTestPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Modularer Word-Editor (Test)</h1>
      <Toolbar />
      <EditorCanvas />
    </div>
  );
}
