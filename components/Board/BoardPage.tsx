import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SuperadminLayout from "@/components/SuperadminLayout";
import FormPanel from "./FormPanel";
import FilterPanel from "./FilterPanel";
import EntryCard from "./EntryCard";
import { Entry } from "./types";

export default function BoardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    status: "",
    category: "",
    notes: "",
  });

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
      await loadEntries();
    } else {
      setUploadResult(result.message || "Fehler beim Import.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(() => setUploadResult(null), 4000);
  };

  const handleManualAdd = async () => {
    const payload = { ...form };
    const res = await fetch("/api/admin/board/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setForm({ title: "", status: "", category: "", notes: "" });
      await loadEntries();
    } else {
      setUploadResult("Fehler beim Hinzufügen.");
      setTimeout(() => setUploadResult(null), 4000);
    }
  };

  const handleUpdate = async () => {
    if (!editId) return;
    const payload = { id: editId, ...form };
    const res = await fetch("/api/admin/board/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setEditId(null);
      setForm({ title: "", status: "", category: "", notes: "" });
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Superadmin Board</h1>

      <FormPanel
        form={form}
        setForm={setForm}
        onSave={editId ? handleUpdate : handleManualAdd}
        isEditing={!!editId}
        onCancel={() => {
          setEditId(null);
          setForm({ title: "", status: "", category: "", notes: "" });
        }}
      />

      <FilterPanel
        entries={entries}
        selectedStatuses={selectedStatuses}
        selectedCategories={selectedCategories}
        setSelectedStatuses={setSelectedStatuses}
        setSelectedCategories={setSelectedCategories}
        fileInputRef={fileInputRef}
        onUpload={handleUpload}
        filteredEntries={filteredEntries}
      />

      {uploadResult && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded shadow z-50">
          {uploadResult}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEntries.map(entry => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onEdit={(e) => {
              setEditId(e.id);
              setForm({
                title: e.title,
                status: e.status,
                category: e.category,
                notes: e.notes || "",
              });
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

BoardPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
