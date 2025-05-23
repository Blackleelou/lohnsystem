import React, { useState } from "react";
import { Entry } from "./types";

type EntryCardProps = {
  entry: Entry;
  handleUpdate: (entry: Partial<Entry> & { id: number }) => void;
  handleDelete: (id: number) => void;
  onClick: () => void;
};

export default function EntryCard({
  entry,
  handleUpdate,
  handleDelete,
  onClick,
}: EntryCardProps) {
  const isFertig = entry.status.toLowerCase() === "fertig" || entry.status.toLowerCase() === "getestet";
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(entry.title);
  const [status, setStatus] = useState(entry.status);
  const [category, setCategory] = useState(entry.category);
  const [notes, setNotes] = useState(entry.notes || "");

  const handleSave = () => {
    handleUpdate({ id: entry.id, title, status, category, notes });
    setIsEditing(false);
  };

  return (
    <div
      onClick={!isEditing ? onClick : undefined}
      className={`border p-4 rounded-md shadow-sm ${isFertig ? "bg-green-50 border-green-200" : "bg-white"}`}
    >
      {isEditing ? (
        <>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-2 border px-2 py-1 rounded text-sm" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mb-2 border px-2 py-1 rounded text-sm">
            <option value="">Status wählen</option>
            <option value="geplant">Geplant</option>
            <option value="offen">Offen</option>
            <option value="in Bearbeitung">In Bearbeitung</option>
            <option value="getestet">Getestet</option>
            <option value="fertig">Fertig</option>
          </select>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mb-2 border px-2 py-1 rounded text-sm" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full mb-2 border px-2 py-1 rounded text-sm" rows={2} />

          <div className="flex justify-end gap-2 mt-2">
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded">Speichern</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm rounded">Abbrechen</button>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-semibold text-lg text-gray-800 mb-2 flex items-center gap-2">
            {entry.title}
            {isFertig && <span className="text-green-600 font-bold text-sm">✔</span>}
          </h2>
          <p className="text-sm text-gray-500">Kategorie: {entry.category}</p>
          <p className="text-sm text-gray-500">Status: {entry.status}</p>
          {entry.notes && <p className="text-sm text-gray-700 mt-2">{entry.notes}</p>}
          <p className="text-xs text-gray-400 mt-4">
            Erstellt: {new Date(entry.createdAt).toLocaleString()}
            {entry.completedAt && <><br />Fertig: {new Date(entry.completedAt).toLocaleString()}</>}
          </p>
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="text-blue-600 hover:underline text-sm"
            >
              Bearbeiten
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(entry.id);
              }}
              className="text-red-600 hover:underline text-sm"
            >
              Löschen
            </button>
          </div>
        </>
      )}
    </div>
  );
}
