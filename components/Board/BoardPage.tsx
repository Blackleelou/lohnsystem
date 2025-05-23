// components/Board/BoardPage.tsx

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SuperadminLayout from "@/components/SuperadminLayout";
import { Entry } from "./types";
import FormPanel from "./FormPanel";
import FilterPanel from "./FilterPanel";
import EntryCard from "./EntryCard";
import EntryModal from "./EntryModal";

export default function BoardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

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
      setToast(result.message || "Import abgeschlossen.");
      setIsRefreshing(true);
      setTimeout(() => {
        loadEntries().then(() => setIsRefreshing(false));
      }, 500);
    } else {
      setToast(result.message || "Fehler beim Import.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(() => setToast(null), 4000);
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
      setToast("Eintrag hinzugefügt.");
      setNewTitle("");
      setNewStatus("");
      setNewCategory("");
      setNewNotes("");
      await loadEntries();
    } else {
      setToast("Fehler beim Speichern.");
    }

    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdate = async () => {
    if (!editId) return;
    const payload = {
      id: editId,
      title: newTitle,
      status: newStatus,
      category: newCategory,
      notes: newNotes,
    };

    const res = await fetch("/api/admin/board/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setToast("Eintrag aktualisiert.");
      setEditId(null);
      setNewTitle("");
      setNewStatus("");
      setNewCategory("");
      setNewNotes("");
      await loadEntries();
    } else {
      setToast("Fehler beim Aktualisieren.");
    }

    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Eintrag wirklich löschen?")) return;

    const res = await fetch("/api/admin/board/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setToast("Eintrag gelöscht.");
      await loadEntries();
    } else {
      setToast("Fehler beim Löschen.");
    }

    setTimeout(() => setToast(null), 4000);
  };

  const filteredEntries = entries.filter((e) => {
    const status = e.status.toLowerCase();
    const category = e.category.toLowerCase();
    const statusMatch =
      selectedStatuses.length === 0 || selectedStatuses.includes(status);
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(category);
    return statusMatch && categoryMatch;
  });

  const uniqueStatuses = [...new Set(entries.map((e) => e.status.toLowerCase()))];
  const uniqueCategories = [...new Set(entries.map((e) => e.category.toLowerCase()))];
    return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Superadmin Board</h1>

      <FormPanel
        isEditing={editId !== null}
        title={newTitle}
        status={newStatus}
        category={newCategory}
        notes={newNotes}
        onChangeTitle={setNewTitle}
        onChangeStatus={setNewStatus}
        onChangeCategory={setNewCategory}
        onChangeNotes={setNewNotes}
        onSave={editId !== null ? handleUpdate : handleManualAdd}
        onCancel={() => {
          setEditId(null);
          setNewTitle("");
          setNewStatus("");
          setNewCategory("");
          setNewNotes("");
        }}
      />

      <FilterPanel
        statuses={uniqueStatuses}
        categories={uniqueCategories}
        selectedStatuses={selectedStatuses}
        selectedCategories={selectedCategories}
        onToggle={(value, group) => {
          const current = group === "status" ? selectedStatuses : selectedCategories;
          const setter = group === "status" ? setSelectedStatuses : setSelectedCategories;
          setter(
            current.includes(value)
              ? current.filter((v) => v !== value)
              : [...current, value]
          );
        }}
      />

      <div className="flex flex-wrap gap-4 items-center mb-4">
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
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Datei auswählen & importieren
        </label>
        <button
          onClick={() => {
            const data = JSON.stringify(filteredEntries, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Export_ToDo_${new Date()
              .toISOString()
              .replace(/[:.]/g, "_")}.json`;
            a.click();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Als JSON exportieren
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEntries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            setEditId={setEditId}
            setNewTitle={setNewTitle}
            setNewStatus={setNewStatus}
            setNewCategory={setNewCategory}
            setNewNotes={setNewNotes}
            handleDelete={handleDelete}
            onClick={() => setSelectedEntry(entry)}
          />
        ))}
      </div>

      {selectedEntry && (
        <EntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

BoardPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
