import React from "react";
import { Entry } from "./types";

type EntryCardProps = {
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onDelete: (id: number) => void;
};

export default function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const isDone = entry.status.toLowerCase() === "fertig";

  return (
    <div
      className={`border p-4 rounded-md shadow-sm hover:shadow transition ${
        isDone ? "bg-green-50 border-green-300" : "bg-white border-gray-200"
      }`}
    >
      <h2 className="font-semibold text-lg text-gray-800 mb-2">{entry.title}</h2>
      <p className="text-sm text-gray-500">Kategorie: {entry.category}</p>
      <p className={`text-sm mb-2 ${isDone ? "text-green-700 font-medium" : "text-gray-500"}`}>
        Status: {entry.status}
        {isDone && (
          <span className="ml-2 inline-block text-green-600">✔</span>
        )}
      </p>
      {entry.notes && <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{entry.notes}</p>}
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
          onClick={() => onEdit(entry)}
          className="text-blue-600 hover:underline text-sm"
        >
          Bearbeiten
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-red-600 hover:underline text-sm"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}
