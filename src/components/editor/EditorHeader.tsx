// src/components/editor/EditorHeader.tsx

import ToolbarGroupFile from "./toolbar/ToolbarGroupFile";
import ToolbarGroupText from "./toolbar/ToolbarGroupText";
import ToolbarGroupInsert from "./toolbar/ToolbarGroupInsert";

export default function EditorHeader() {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 p-2 border border-gray-200 rounded shadow-sm bg-white">
      <ToolbarGroupFile />
      <ToolbarGroupText />
      <ToolbarGroupInsert />
    </div>
  );
}
