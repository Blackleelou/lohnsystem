import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SuperadminLayout from "@/components/SuperadminLayout";

type Entry = {
  id: number;
  title: string;
  status: string;
  category: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
};

export default function BoardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.email !== "jantzen.chris@gmail.com") {
      router.replace("/dashboard");
    }
  }, [session, status]);

  const loadEntries = async () => {
    const res = await fetch("/api/admin/board");
    const data = await res.json();
    setEntries(data.entries);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadResult(null);

    const res = await fetch("/api/admin/board/import", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setUploading(false);

    if (res.ok) {
      await loadEntries(); // wichtig!
      setUploadResult(result.message || "Import abgeschlossen.");
    } else {
      setUploadResult(result.message || "Fehler beim Import.");
    }

    setTimeout(() => setUploadResult(null), 4000);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `superadmin-board-${new Date().toISOString()}.json`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Superadmin Board</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 bg-white border border-gray-200 p-4 rounded shadow-sm">
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">
            JSON-Datei importieren:
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleUpload}
            className="block w-full text-sm text-gray-600"
          />
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-blue-600 mt-1">
              <span className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
              Hochladen...
            </div>
          )}
        </div>

        <div className="sm:ml-auto">
          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Als JSON exportieren
          </button>
        </div>
      </div>

      {uploadResult && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded shadow z-50">
          {uploadResult}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {entries.map((entry) => {
          const isDone = entry.status.toLowerCase() === "fertig";
          return (
            <div
              key={entry.id}
              className={`border p-4 rounded-md shadow-sm hover:shadow transition ${
                isDone ? "bg-green-50 border-green-300" : "bg-white border-gray-200"
              }`}
            >
              <h2 className="font-semibold text-lg text-gray-800 mb-2">{entry.title}</h2>
              <p className="text-sm text-gray-500">Kategorie: {entry.category}</p>
              <p className={`text-sm mb-2 ${isDone ? "text-green-700 font-medium" : "text-gray-500"}`}>
                Status: {entry.status}
              </p>
              {entry.notes && (
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{entry.notes}</p>
              )}
              <p className="text-xs text-gray-400 mt-4">
                Erstellt: {new Date(entry.createdAt).toLocaleString()}
                {entry.completedAt && (
                  <>
                    <br />
                    Fertig: {new Date(entry.completedAt).toLocaleString()}
                  </>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

BoardPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
