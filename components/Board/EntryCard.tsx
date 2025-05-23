// components/Board/EntryCard.tsx

import React, { useState } from "react";
import { Entry } from "./types";
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from "./constants";

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
    status:
      ["getestet", "fertig"].includes(entry.status.toLowerCase())
        ? "fertig"
        : entry.status,
    category: Array.isArray(entry.category)
      ? entry.category
      : entry.category.split(",").map((c) => c.trim()),
    notes: entry.notes || "",
  });

  const toggleCategory = (value: string) => {
    setEditData((prev) => ({
      ...prev,
      category: prev.category.includes(value)
        ? prev.category.filter((c) => c !== value)
        : [...prev.category, value],
    }));
  };

  const saveChanges = () => {
    handleUpdate({
      id: entry.id,
      title: editData.title,
      status: editData.status,
      category: editData.category.join(", "),
      notes: editData.notes,
    });
    setIsEditing(false);
  };

  return (
    <div
      onClick={!isEditing ? onClick : undefined}
      className={`border p-4 rounded shadow-sm ${
        isFertig ? "bg-green-50 border-green-200" : "bg-white"
      }`}
    >
      {isEditing ? (
        <>
          <input
            className="w-full text-lg font-semibold text-gray-800 mb-3 border rounded px-2 py-1"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />

          <div className="mb-3">
            <p className="font-medium text-sm mb-1 text-gray-700">Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setEditData({ ...editData, status: opt })}
                  className={`px-3 py-1 rounded border text-sm transition ${
                    editData.status === opt
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <p className="font-medium text-sm mb-1 text-gray-700">Kategorie</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleCategory(opt)}
                  className={`px-3 py-1 rounded border text-sm transition ${
                    editData.category.includes(opt)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <input
            className="w-full border px-2 py-1 text-sm rounded mb-2"
            placeholder="Notizen"
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
          />

          <div className="flex justify-end gap-2 mt-3">
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
