import ToolbarGroupFile from "./toolbar/ToolbarGroupFile";
import ToolbarGroupFormat from "./toolbar/ToolbarGroupFormat";
import ToolbarGroupText from "./toolbar/ToolbarGroupText";
import ToolbarGroupInsert from "./toolbar/ToolbarGroupInsert";

export default function EditorHeader() {
  return (
    <div className="sticky top-0 z-30 w-full bg-white border-b shadow-sm px-4 py-2 flex flex-wrap items-center gap-6">
      <ToolbarGroupFile />
      <ToolbarGroupFormat />
      <ToolbarGroupText />
      <ToolbarGroupInsert />
    </div>
  );
}
