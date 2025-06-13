import EditorCanvas from "./EditorCanvas";

export default function EditorRoot() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-xl border border-gray-300" style={{ width: 794, height: 1123 }}>
        <EditorCanvas />
      </div>
    </div>
  );
}
