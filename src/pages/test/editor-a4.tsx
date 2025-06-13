import dynamic from "next/dynamic";

const EditorRoot = dynamic(() => import("@/components/editor/EditorRoot"), { ssr: false });

export default function EditorA4TestPage() {
  return (
    <div>
      <EditorRoot />
    </div>
  );
}
