import dynamic from "next/dynamic";

// EditorRoot nur im Browser laden, weil Konva auf window zugreift
const EditorRoot = dynamic(() => import("@/components/editor/EditorRoot"), {
  ssr: false,
});

export default function EditorA4TestPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">A4-Editor (Testseite)</h1>
      <EditorRoot />
    </div>
  );
}
