import React from "react";

type Entry = {
  id: number;
  title: string;
  status: string;
  category: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  onEdit: () => void;
  onDelete: () => void;
};

export default function EntryCard({ id, title, status, category, notes, createdAt, completedAt, onEdit, onDelete }: Entry) {
  const isDone = status.toLowerCase() === "fertig";

  return (
    <div
      key={id}
      className={`border p-4 rounded-md shadow-sm transition ${
        isDone ? "bg-green-50 border-green-300" : "bg-white border-gray-200"
      }`}
    >
      <h2 className="font-semibold text-lg text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500">Kategorie: {category}</p>
      <p className={`text-sm mb-2 ${isDone ? "text-green-700 font-medium" : "text-gray-500"}`}>
        Status: {status} {isDone && "✔"}
      </p>
      {notes && <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{notes}</p>}
      <p className="text-xs text-gray-400 mt-4">
        Erstellt: {new Date(createdAt).toLocaleString()}
        {completedAt && (
          <>
            <br />
            Fertig: {new Date(completedAt).toLocaleString()}
          </>
        )}
      </p>
      <div className="flex justify-end gap-2 mt-3">
        <button onClick={onEdit} className="text-blue-600 hover:underline text-sm">Bearbeiten</button>
        <button onClick={onDelete} className="text-red-600 hover:underline text-sm">Löschen</button>
      </div>
    </div>
  );
}
