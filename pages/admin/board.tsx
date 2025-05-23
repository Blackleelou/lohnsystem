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
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  const handleExport = () => {
    const filtered = entries.filter((e) => {
      const statusOk = selectedStatuses.length === 0 || selectedStatuses.includes(e.status.toLowerCase());
      const categoryOk = selectedCategories.length === 0 || selectedCategories.includes(e.category.toLowerCase());
      return statusOk && categoryOk;
    });

    if (filtered.length === 0) return;

    const blob = new Blob([JSON.stringify(filtered, null, 2)], {
      type: "application/json",
    });

    const timestamp = new Date()
      .toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/[.:]/g, "_")
      .replace(", ", "_");

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Export_ToDo_${timestamp}.json`;
    a.click();
  };

  const handleManualAdd = async () => {
    const payload = {
      title: newTitle,
      status: newStatus,
      category: newCategory,
      notes: newNotes,
    };

    const res = await fetch("/api/admin/board/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setNewTitle("");
      setNewStatus("");
      setNewCategory("");
      setNewNotes("");
      await loadEntries();
    }
  };

  const uniqueCategories = Array.from(new Set(entries.map(e => e.category.toLowerCase())));
  const uniqueStatuses = Array.from(new Set(entries.map(e => e.status.toLowerCase())));

  const toggleCheckbox = (value: string, group: string) => {
    const updater = group === "status" ? setSelectedStatuses : setSelectedCategories;
    const current = group === "status" ? selectedStatuses : selectedCategories;

    updater(current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]);
  };

  const filteredEntries = entries.filter((e) => {
    const statusOk = selectedStatuses.length === 0 || selectedStatuses.includes(e.status.toLowerCase());
    const categoryOk = selectedCategories.length === 0 || selectedCategories.includes(e.category.toLowerCase());
    return statusOk && categoryOk;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Superadmin Board</h1>

      {/* Manuell hinzufügen */}
      <div className="bg-white border border-gray-200 p-4 rounded shadow-sm mb-6">
        <h2 className="text-md font-semibold text-gray-800 mb-2">Manuellen Eintrag hinzufügen</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
          <input placeholder="Titel" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="border px-2 py-1 text-sm rounded w-full" />
          <input placeholder="Status" value={newStatus} onChange={e => setNewStatus(e.target.value)} className="border px-2 py-1 text-sm rounded w-full" />
          <input placeholder="Kategorie" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="border px-2 py-1 text-sm rounded w-full" />
          <input placeholder="Notizen" value={newNotes} onChange={e => setNewNotes(e.target.value)} className="border px-2 py-1 text-sm rounded w-full" />
        </div>
        <button onClick={handleManualAdd} className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded">
          Hinzufügen
        </button>
      </div>

      {/* Upload & Filter */}
      <div className="flex flex-col gap-4 mb-6 bg-white border border-gray-200 p-4 rounded shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="inline-block cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Datei auswählen & importieren
          </label>

          <button
            onClick={handleExport}
            disabled={filteredEntries.length === 0}
            className={`px-4 py-2 rounded text-sm text-white transition ${
              filteredEntries.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Als JSON exportieren
          </button>
        </div>

        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Status-Filter</p>
            <div className="flex gap-2 flex-wrap">
              {uniqueStatuses.map((s) => (
                <label key={s} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(s)}
                    onChange={() => toggleCheckbox(s, "status")}
                    className="accent-blue-600"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Kategorie-Filter</p>
            <div className="flex gap-2 flex-wrap">
              {uniqueCategories.map((c) => (
                <label key={c} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(c)}
                    onChange={() => toggleCheckbox(c, "category")}
                    className="accent-blue-600"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {uploadResult && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded shadow z-50">
          {uploadResult}
        </div>
      )}

      {isRefreshing && (
        <div className="fixed top-20 right-4 bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded shadow z-50">
          Aktualisiere Daten...
        </div>
      )}

      
  {/* Upload & Filter */}
  <div className="flex flex-col gap-4 mb-6 bg-white border border-gray-200 p-4 rounded shadow-sm">
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        id="fileUpload"
      />
      <label
        htmlFor="fileUpload"
        className="inline-block cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
      >
        Datei auswählen & importieren
      </label>

      <button
        onClick={handleExport}
        disabled={filteredEntries.length === 0}
        className={`px-4 py-2 rounded text-sm text-white transition ${
          filteredEntries.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Als JSON exportieren
      </button>
    </div>

    <div className="flex flex-wrap gap-6">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Status-Filter</p>
        <div className="flex gap-2 flex-wrap">
          {uniqueStatuses.map((s) => (
            <label key={s} className="flex items-center gap-1 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStatuses.includes(s)}
                onChange={() => toggleCheckbox(s, "status")}
                className="accent-blue-600"
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Kategorie-Filter</p>
        <div className="flex gap-2 flex-wrap">
          {uniqueCategories.map((c) => (
            <label key={c} className="flex items-center gap-1 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(c)}
                onChange={() => toggleCheckbox(c, "category")}
                className="accent-blue-600"
              />
              {c}
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
  
        {filteredEntries.map((entry) => {
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
