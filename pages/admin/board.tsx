import { useEffect, useState, useRef } from "react";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [manualResult, setManualResult] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      setUploadResult(result.message || "Import abgeschlossen.");
      setIsRefreshing(true);
      setTimeout(() => {
        loadEntries().then(() => setIsRefreshing(false));
      }, 500);
    } else {
      setUploadResult(result.message || "Fehler beim Import.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(() => setUploadResult(null), 4000);
  };

  const handleManualAdd = async () => {
    const payload = { title: newTitle, status: newStatus, category: newCategory, notes: newNotes };
    const res = await fetch("/api/admin/board/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok) {
      setManualResult("Eintrag wurde hinzugefügt.");
      setNewTitle("");
      setNewStatus("");
      setNewCategory("");
      setNewNotes("");
      await loadEntries();
    } else {
      setManualResult(result.message || "Fehler beim Hinzufügen.");
    }

    setTimeout(() => setManualResult(null), 3000);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    const payload = { id: editId, title: newTitle, status: newStatus, category: newCategory, notes: newNotes };
    const res = await fetch("/api/admin/board/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setEditId(null);
      setNewTitle("");
      setNewStatus("");
      setNewCategory("");
      setNewNotes("");
      await loadEntries();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Eintrag wirklich löschen?")) return;
    await fetch("/api/admin/board/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadEntries();
  };

  const filteredEntries = entries.filter(e =>
    (selectedStatuses.length === 0 || selectedStatuses.includes(e.status.toLowerCase())) &&
    (selectedCategories.length === 0 || selectedCategories.includes(e.category.toLowerCase()))
  );

  const uniqueStatuses = [...new Set(entries.map(e => e.status.toLowerCase()))];
  const uniqueCategories = [...new Set(entries.map(e => e.category.toLowerCase()))];

  const toggleCheckbox = (value: string, group: string) => {
    const current = group === "status" ? selectedStatuses : selectedCategories;
    const updater = group === "status" ? setSelectedStatuses : setSelectedCategories;
    updater(current.includes(value) ? current.filter(v => v !== value) : [...current, value]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Superadmin Board</h1>

      <div className="bg-white border border-gray-200 p-4 rounded shadow-sm mb-6">
        <h2 className="text-md font-semibold text-gray-800 mb-2">{editId ? "Eintrag bearbeiten" : "Manuellen Eintrag hinzufügen"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
          <input placeholder="Titel" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="border px-2 py-1 text-sm rounded w-full" />
          <input placeholder="Status" value={newStatus} onChange={e => setNewStatus(e.target.value)} className="border px-2 py-1 text-sm rounded w-full" />
          <input placeholder="Kategorie" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="border px-2 py-1 text-sm rounded w-full" />
          <input placeholder="Notizen" value={newNotes} onChange={e => setNewNotes(e.target.value)} className="border px-2 py-1 text-sm rounded w-full" />
        </div>
        {editId ? (
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded">Speichern</button>
            <button onClick={() => {
              setEditId(null);
              setNewTitle("");
              setNewStatus("");
              setNewCategory("");
              setNewNotes("");
            }} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm rounded">Abbrechen</button>
          </div>
        ) : (
          <button onClick={handleManualAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded">Hinzufügen</button>
        )}
      </div>

      {manualResult && (
        <div className="fixed top-4 left-4 bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded shadow z-50">
          {manualResult}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEntries.map(entry => {
          const isDone = entry.status.toLowerCase() === "fertig";
          return (
            <div key={entry.id} className={`border p-4 rounded-md shadow-sm transition ${isDone ? "bg-green-50 border-green-300" : "bg-white border-gray-200"}`}>
              <h2 className="font-semibold text-lg text-gray-800 mb-2">
                {isDone && <span className="inline-block mr-1 text-green-600">✓</span>}
                {entry.title}
              </h2>
              <p className="text-sm text-gray-500">Kategorie: {entry.category}</p>
              <p className={`text-sm ${isDone ? "text-green-700 font-medium" : "text-gray-500"}`}>Status: {entry.status}</p>
              {entry.notes && <p className="text-sm text-gray-700 mt-2">{entry.notes}</p>}
              <p className="text-xs text-gray-400 mt-4">
                Erstellt: {new Date(entry.createdAt).toLocaleString()}
                {entry.completedAt && <><br />Fertig: {new Date(entry.completedAt).toLocaleString()}</>}
              </p>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => {
                  setEditId(entry.id);
                  setNewTitle(entry.title);
                  setNewStatus(entry.status);
                  setNewCategory(entry.category);
                  setNewNotes(entry.notes || "");
                }} className="text-blue-600 hover:underline text-sm">Bearbeiten</button>
                <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:underline text-sm">Löschen</button>
              </div>
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
