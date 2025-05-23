import { useState } from "react";

type Props = {
  onSubmit: (data: { title: string; status: string; category: string; notes: string }) => void;
  editMode?: boolean;
  initialValues?: { title: string; status: string; category: string; notes: string };
  onCancel?: () => void;
};

export default function FormPanel({ onSubmit, editMode = false, initialValues, onCancel }: Props) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [status, setStatus] = useState(initialValues?.status || "");
  const [category, setCategory] = useState(initialValues?.category || "");
  const [notes, setNotes] = useState(initialValues?.notes || "");

  const handleSubmit = () => {
    onSubmit({ title, status, category, notes });
    if (!editMode) {
      setTitle("");
      setStatus("");
      setCategory("");
      setNotes("");
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-4 rounded shadow-sm mb-6">
      <h2 className="text-md font-semibold text-gray-800 mb-2">{editMode ? "Eintrag bearbeiten" : "Manuell hinzufügen"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel" className="border px-2 py-1 text-sm rounded w-full" />
        <select value={status} onChange={e => setStatus(e.target.value)} className="border px-2 py-1 text-sm rounded w-full">
          <option value="">Status wählen</option>
          <option>geplant</option>
          <option>offen</option>
          <option>in Bearbeitung</option>
          <option>getestet</option>
          <option>fertig</option>
        </select>
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Kategorie" className="border px-2 py-1 text-sm rounded w-full" />
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notizen" className="border px-2 py-1 text-sm rounded w-full" />
      </div>

      <div className="flex gap-2">
        <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded">Speichern</button>
        {editMode && onCancel && (
          <button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm rounded">Abbrechen</button>
        )}
      </div>
    </div>
  );
}
