import { useState } from "react";

type FormProps = {
  editId: number | null;
  onSave: (data: { title: string; status: string; category: string; notes: string }) => void;
  onCancel: () => void;
  initialValues?: {
    title: string;
    status: string;
    category: string;
    notes: string;
  };
};

const statusOptions = ["geplant", "offen", "in Bearbeitung", "getestet", "fertig"];

export default function FormPanel({ editId, onSave, onCancel, initialValues }: FormProps) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [status, setStatus] = useState(initialValues?.status || "");
  const [category, setCategory] = useState(initialValues?.category || "");
  const [notes, setNotes] = useState(initialValues?.notes || "");

  const handleSubmit = () => {
    if (!title || !status || !category) return;
    onSave({ title, status, category, notes });
  };

  return (
    <div className="bg-white border border-gray-200 p-4 rounded shadow-sm mb-6">
      <h2 className="text-md font-semibold text-gray-800 mb-2">
        {editId ? "Eintrag bearbeiten" : "Manuellen Eintrag hinzufügen"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
        <input
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 text-sm rounded w-full"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-2 py-1 text-sm rounded w-full"
        >
          <option value="">Status wählen</option>
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          placeholder="Kategorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-2 py-1 text-sm rounded w-full"
        />
        <input
          placeholder="Notizen"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border px-2 py-1 text-sm rounded w-full"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
        >
          {editId ? "Speichern" : "Hinzufügen"}
        </button>
        {editId && (
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded"
          >
            Abbrechen
          </button>
        )}
      </div>
    </div>
  );
}
