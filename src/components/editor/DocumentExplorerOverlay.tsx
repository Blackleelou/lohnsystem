import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Eye, Users, Lock, Globe } from "lucide-react";

type Document = {
  id: string;
  title: string;
  createdAt: string;
  visibility: "PRIVATE" | "TEAM" | "SHARED" | "PUBLIC";
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (docId: string) => void;
};

export default function DocumentExplorerOverlay({ isOpen, onClose, onSelect }: Props) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PRIVATE" | "TEAM" | "SHARED" | "PUBLIC">("ALL");

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/editor/list")
      .then(res => res.json())
      .then(data => {
        setDocuments(data.documents || []);
      });
  }, [isOpen]);

  const filtered = documents
    .filter(doc =>
      doc.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "ALL" || doc.visibility === filter)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const icon = (v: Document["visibility"]) =>
    v === "PRIVATE" ? <Lock size={16} className="text-gray-500" /> :
    v === "TEAM" ? <Users size={16} className="text-blue-500" /> :
    v === "SHARED" ? <Eye size={16} className="text-green-500" /> :
    <Globe size={16} className="text-orange-500" />;

  const labelText = (v: Document["visibility"]) =>
    v === "PRIVATE" ? "Privat" :
    v === "TEAM" ? "Team" :
    v === "SHARED" ? "Geteilt" :
    "Öffentlich";

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-3xl rounded shadow p-6 space-y-4">
          <Dialog.Title className="text-lg font-semibold">📁 Dokumente</Dialog.Title>

          {/* 🔍 Suchfeld */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Dokument suchen…"
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
          />

          {/* 🧭 Filter */}
          <div className="flex gap-2 text-xs">
            {["ALL", "PRIVATE", "TEAM", "SHARED", "PUBLIC"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-2 py-1 rounded border ${
                  filter === f
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                {f === "ALL" ? "Alle" : labelText(f as any)}
              </button>
            ))}
          </div>

          {/* 📄 Liste */}
          <div className="divide-y border-t">
            {filtered.length === 0 && (
              <div className="text-sm text-gray-400 py-4 text-center">Keine passenden Dokumente gefunden.</div>
            )}
            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-2 hover:bg-gray-50 cursor-pointer px-2 rounded"
                onClick={() => {
                  onSelect(doc.id);
                  onClose();
                }}
              >
                <div className="flex items-center gap-2 text-sm">
                  {icon(doc.visibility)}
                  <span>{doc.title}</span>
                  <span className={`
                    text-xs font-medium ml-2 px-2 py-0.5 rounded
                    ${
                      doc.visibility === "PRIVATE" ? "bg-gray-100 text-gray-600" :
                      doc.visibility === "TEAM" ? "bg-blue-100 text-blue-700" :
                      doc.visibility === "SHARED" ? "bg-green-100 text-green-700" :
                      "bg-orange-100 text-orange-700"
                    }
                  `}>
                    {labelText(doc.visibility)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
