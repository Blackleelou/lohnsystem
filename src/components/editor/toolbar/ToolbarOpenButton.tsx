import { useState } from "react";
import { useRouter } from "next/router";
import DocumentPickerOverlay from "../DocumentPickerOverlay";

export default function ToolbarOpenButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSelect = (doc: { id: string }) => {
    router.push(`/test/editor-word?id=${doc.id}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
      >
        Öffnen
      </button>

      <DocumentPickerOverlay
        open={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
