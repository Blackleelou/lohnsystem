import React, { useState } from "react";
import { Entry } from "./types";

type EntryCardProps = {
  entry: Entry;
  handleUpdate: (updated: Partial<Entry> & { id: number }) => void;
  handleDelete: (id: number) => void;
  onClick: () => void;
};

export default function EntryCard({
  entry,
  handleUpdate,
  handleDelete,
  onClick,
}: EntryCardProps) {
  const isFertig = ["fertig", "getestet"].includes(entry.status.toLowerCase());
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: entry.title,
    status: entry.status,
    category: entry.category,
    notes: entry.notes || "",
  });

  const saveChanges = () => {
    handleUpdate({ id: entry.id, ...editData });
    setIsEditing(false);
  };

  return (
    <div
      onClick={!isEditing ? onClick : undefined}
      className={`border p-4 rounded-md shadow-sm ${
        isFertig ? "bg-green-50 border-green-200" : "bg-white"
      }`}
    >
      {isEditing ? (
        <>
          <input
            className="w-full text-lg font-semibold text-gray-800 mb-2 border rounded px-2 py-1"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />
          <select
            className="w-full border px-2 py-1 text-sm rounded mb-2"
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
          >
            {["geplant", "offen", "in Bearbeitung", "getestet", "fertig"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            className="w-full border px-2 py-1 text-sm rounded mb-2"
            placeholder="Kategorie"
            value={editData.category}
            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
          />
          <input
            className="w-full border px-2 py-1 text-sm rounded mb-2"
            placeholder="Notizen"
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={saveChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
            >
              Speichern
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 text-sm rounded"
            >
              Abbrechen
            </button>
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
            {entry.completedAt && (
              <>
                <br />
                Fertig: {new Date(entry.completedAt).toLocaleString()}
              </>
            )}
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
