// src/components/editor/EditorToolbar.tsx
import ToolbarGroupText from "./toolbar/ToolbarGroupText";

export default function EditorToolbar() {
  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <ToolbarGroupText />
    </div>
  );
}
