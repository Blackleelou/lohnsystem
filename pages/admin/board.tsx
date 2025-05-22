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

  // Manual add form states
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
      setNewTitle(""); setNewStatus(""); setNewCategory(""); setNewNotes("");
      await loadEntries();
    }
  };

  const uniqueCategories = Array.from(new Set(entries.map(e => e.category.toLowerCase())));
  const uniqueStatuses = Array.from(new Set(entries.map(e => e.status.toLowerCase())));

  const toggleCheckbox = (value: string, group: string) => {
    const updater = group === "status" ? setSelectedStatuses : setSelectedCategories;
    const current = group === "status" ? selectedStatuses : selectedCategories;

    updater(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  const filteredEntries = entries.filter((e) => {
    const statusOk = selectedStatuses.length === 0 || selectedStatuses.includes(e.status.toLowerCase());
    const categoryOk = selectedCategories.length === 0 || selectedCategories.includes(e.category.toLowerCase());
    return statusOk && categoryOk;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Superadmin Board</h1>

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

      ... (der restliche Code bleibt unverändert)
    </div>
  );
}

BoardPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
