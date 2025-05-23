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

    if (res.ok) {
      setNewTitle("");
      setNewStatus("");
      setNewCategory("");
      setNewNotes("");
      await loadEntries();
    }
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
        filteredEntries={filteredEntries}
        selectedStatuses={selectedStatuses}
        selectedCategories={selectedCategories}
        uniqueStatuses={uniqueStatuses}
        uniqueCategories={uniqueCategories}
        setSelectedStatuses={setSelectedStatuses}
        setSelectedCategories={setSelectedCategories}
        fileInputRef={fileInputRef}
        handleUpload={handleUpload}
        uploadResult={uploadResult}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEntries.map(entry => (
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
    </div>
  );
}

BoardPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
