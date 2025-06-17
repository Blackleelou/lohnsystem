import { createPortal } from "react-dom";
import { ChangeEvent } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: File) => void;
}

export default function ImageInsertOverlay({ isOpen, onClose, onSelect }: Props) {
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Bild einfügen</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.[0]) onSelect(e.target.files[0]);
          }}
          className="mb-4"
        />
        <div className="flex justify-end">
          <button onClick={onClose} className="px-3 py-1 text-sm text-gray-600 hover:underline">
            Abbrechen
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
