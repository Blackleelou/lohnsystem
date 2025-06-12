import { useEditorStore } from "./useEditorStore";

export default function Toolbar() {
  const { addText } = useEditorStore();

  return (
    <div className="mb-4">
      <button
        onClick={addText}
        className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
      >
        Text hinzufügen
      </button>
    </div>
  );
}
