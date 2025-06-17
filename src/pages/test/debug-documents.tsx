import { useEffect, useState } from "react";

type Document = {
  id: string;
  title: string;
  createdAt: string;
  visibility: string;
  format: string;
};

export default function DebugDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/editor/list");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Abrufen");
      setDocuments(data.documents);
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Wirklich Dokument ${id} löschen?`)) return;
    try {
      const res = await fetch(`/api/editor/delete?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Löschen fehlgeschlagen");
      setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    } catch (err) {
      alert("Fehler beim Löschen");
      console.error(err);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Wirklich ALLE Dokumente unwiderruflich löschen?")) return;
    try {
      const res = await fetch("/api/editor/delete-all", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Löschen aller Dokumente fehlgeschlagen");
      setDocuments([]);
    } catch (err) {
      alert("Fehler beim Löschen aller Dokumente");
      console.error(err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🧪 Debug: Editor-Dokumente</h1>

      <div className="mb-4 flex gap-4">
        <button
          onClick={loadDocuments}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Neu laden
        </button>
        <button
          onClick={handleDeleteAll}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Alle löschen
        </button>
      </div>

      {loading ? (
        <p>Lade...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Titel</th>
              <th className="p-2">Format</th>
              <th className="p-2">Sichtbarkeit</th>
              <th className="p-2">Erstellt</th>
              <th className="p-2">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-t">
                <td className="p-2">{doc.title || <em>(kein Titel)</em>}</td>
                <td className="p-2 text-center">{doc.format}</td>
                <td className="p-2 text-center">{doc.visibility}</td>
                <td className="p-2 text-center">
                  {new Date(doc.createdAt).toLocaleString()}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:underline"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
