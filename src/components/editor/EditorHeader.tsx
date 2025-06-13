import EditorToolbarFormat from "./EditorToolbarFormat";
import EditorToolbarText from "./EditorToolbarText";

export default function EditorHeader() {
  return (
    <div className="sticky top-0 z-30 w-full bg-white border-b shadow-sm px-4 py-2 flex flex-wrap items-center justify-between gap-4">
      <EditorToolbarFormat />
      <EditorToolbarText />
    </div>
  );
}
