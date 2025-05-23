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
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from "./constants";

export default function BoardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [activeTab, setActiveTab] = useState<"import" | "export" | "manual">("manual");

  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newCategory, setNewCategory] = useState<string[]>([]);
  const [newNotes, setNewNotes] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.email !== "jantzen.chris@gmail.com") {
      router.replace("/dashboard");
    }
  }, [session, status]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

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

    const res = await fetch("/api/admin/board/import", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      showToast(result.message || "Import abgeschlossen.");
      await loadEntries();
    } else {
      showToast(result.message || "Fehler beim Import.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleManualAdd = async () => {
    const payload = {
      title: newTitle,
      status: newStatus,
      category: newCategory.join(", "),
      notes: newNotes,
    };
    const res = await fetch("/api/admin/board/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showToast("Eintrag hinzugefügt.");
      setNewTitle("");
      setNewStatus("");
      setNewCategory([]);
      setNewNotes("");
      await loadEntries();
    } else {
      showToast("Fehler beim Speichern.");
    }
  };

  const handleUpdate = async (data: Partial<Entry> & { id: number }) => {
    const res = await fetch("/api/admin/board/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      showToast("Eintrag aktualisiert.");
      await loadEntries();
    } else {
      showToast("Fehler beim Aktualisieren.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Eintrag wirklich löschen?")) return;
    const res = await fetch("/api/admin/board/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      showToast("Eintrag gelöscht.");
      await loadEntries();
    } else {
      showToast("Fehler beim Löschen.");
    }
  };

  const normalizeStatus = (status: string) =>
    ["fertig", "getestet"].includes(status.toLowerCase()) ? "fertig/getestet" : status.toLowerCase();

  const filteredEntries = entries.filter((e) => {
    const normalized = normalizeStatus(e.status);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(normalized);
    const categories = e.category.split(",").map((c) => c.trim().toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || categories.some((c) => selectedCategories.includes(c));
    return matchesStatus && matchesCategory;
  });

  const uniqueStatuses = Array.from(new Set(entries.map((e) => normalizeStatus(e.status))));
  const uniqueCategories = Array.from(
    new Set(entries.flatMap((e) => e.category.split(",").map((c) => c.trim().toLowerCase())))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Superadmin Board</h1>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 text-sm rounded-md border ${
            activeTab === "manual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => setActiveTab("manual")}
        >
          Manuell
        </button>
        <button
          className={`px-4 py-2 text-sm rounded-md border ${
            activeTab === "import" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => setActiveTab("import")}
        >
          Import
        </button>
        <button
          className={`px-4 py-2 text-sm rounded-md border ${
            activeTab === "export" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => setActiveTab("export")}
        >
          Export
        </button>
      </div>

      {activeTab === "manual" && (
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
          onSave={
            editId !== null
              ? () =>
                  handleUpdate({
                    id: editId,
                    title: newTitle,
                    status: newStatus,
                    category: newCategory.join(", "),
                    notes: newNotes,
                  })
              : handleManualAdd
          }
          onCancel={() => {
            setEditId(null);
            setNewTitle("");
            setNewStatus("");
            setNewCategory([]);
            setNewNotes("");
          }}
        />
      )}

      {(activeTab === "import" || activeTab === "export") && (
        <FilterPanel
          uniqueStatuses={uniqueStatuses}
          uniqueCategories={uniqueCategories}
          selectedStatuses={selectedStatuses}
          selectedCategories={selectedCategories}
          setSelectedStatuses={setSelectedStatuses}
          setSelectedCategories={setSelectedCategories}
          fileInputRef={fileInputRef}
          handleUpload={handleUpload}
          filteredEntries={filteredEntries}
        />
      )}

      {activeTab === "export" && (
        <div className="mb-6">
          <button
            onClick={() => {
              const data = JSON.stringify(filteredEntries, null, 2);
              const blob = new Blob([data], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `Export_ToDo_${new Date().toISOString().replace(/[:.]/g, "_")}.json`;
              a.click();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Als JSON exportieren
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEntries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            onClick={() => setSelectedEntry(entry)}
          />
        ))}
      </div>

      {selectedEntry && <EntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

BoardPage.getLayout = (page: React.ReactNode) => <SuperadminLayout>{page}</SuperadminLayout>;
