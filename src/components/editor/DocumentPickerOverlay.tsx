import { useEffect, useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

type EditorDocument = {
  id: string;
  title: string;
  format: string;
  visibility: "PRIVATE" | "TEAM" | "SHARED" | "PUBLIC";
  updatedAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (doc: EditorDocument) => void;
};

export default function DocumentPickerOverlay({ open, onClose, onSelect }: Props) {
  const [documents, setDocuments] = useState<EditorDocument[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;
    fetch("/api/editor/load")
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data.documents || []);
      });
  }, [open]);

  const filtered = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={clsx("fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center transition-opacity", open ? "opacity-100" : "opacity-0 pointer-events-none")}>
      <div className="bg-white w-full max-w-3xl h-[80vh] rounded shadow-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">📁 Dokument öffnen</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="🔍 Titel suchen..."
            className="w-full border rounded px-3 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 mt-12">Keine passenden Dokumente gefunden.</p>
          ) : (
            <ul className="space-y-2">
              {filtered.map((doc) => (
                <li
                  key={doc.id}
                  className="bg-white border rounded p-3 cursor-pointer hover:bg-blue-50 transition"
                  onClick={() => onSelect(doc)}
                >
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>🗂 {doc.format.toUpperCase()} | {doc.visibility}</span>
                    <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
