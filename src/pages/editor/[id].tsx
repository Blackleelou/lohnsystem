import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loadDocument } from "@/lib/api/loadDocument";

export default function EditorPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doc, setDoc] = useState<any>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    loadDocument(id)
      .then(setDoc)
      .catch((err) => {
        console.error(err);
        setError("Dokument konnte nicht geladen werden");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>⏳ Lädt...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!doc) return <div>Kein Dokument gefunden.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{doc.title}</h1>
      <p className="text-gray-600 mb-2">Format: {doc.format}</p>
      <div className="border p-4 bg-white shadow">{doc.content}</div>
    </div>
  );
}
