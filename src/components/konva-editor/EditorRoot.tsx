import EditorCanvas from "./EditorCanvas";
import EditorToolbar from "./EditorToolbar";

export default function EditorRoot() {
  return (
    <div className="p-4 border border-gray-300 rounded shadow">
      <EditorToolbar />
      <EditorCanvas />
    </div>
  );
}
