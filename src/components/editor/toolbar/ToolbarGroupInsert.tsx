import { useEditorStore } from "../useEditorStore";
import { v4 as uuid } from "uuid";

export default function ToolbarGroupInsert() {
  const addElement = useEditorStore((s) => s.addElement);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      addElement({
        id: uuid(),
        type: "image",
        src: reader.result as string,
        x: 100,
        y: 100,
        width: 200,
        height: 150,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-semibold text-gray-600">Einfügen:</span>
      <label className="cursor-pointer underline text-blue-600">
        Bild
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </label>
    </div>
  );
}
