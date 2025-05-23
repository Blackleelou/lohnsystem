// components/Board/EntryCard.tsx

import React from "react";
import { Entry } from "./types";

type EntryCardProps = {
  entry: Entry;
  setEditId: React.Dispatch<React.SetStateAction<number | null>>;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  setNewStatus: React.Dispatch<React.SetStateAction<string>>;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
  setNewNotes: React.Dispatch<React.SetStateAction<string>>;
  handleDelete: (id: number) => void;
  onClick: () => void;
};

export default function EntryCard({
  entry,
  setEditId,
  setNewTitle,
  setNewStatus,
  setNewCategory,
  setNewNotes,
  handleDelete,
  onClick,
}: EntryCardProps) {
  const statusNormalized = entry.status.toLowerCase();
  const isGrünStatus = statusNormalized === "fertig" || statusNormalized === "getestet";

  return (
    <div
      onClick={onClick}
      className={`border p-4 rounded-md shadow-sm cursor-pointer ${
        isGrünStatus ? "bg-green-50 border-green-200" : "bg-white"
      }`}
    >
      <h2 className="font-semibold text-lg text-gray-800 mb-2 flex items-center gap-2">
        {entry.title}
        {isGrünStatus && (
          <span className="text-green-600 font-bold text-sm">✔</span>
        )}
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
            setEditId(entry.id);
            setNewTitle(entry.title);
            setNewStatus(entry.status);
            setNewCategory(entry.category);
            setNewNotes(entry.notes || "");
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
    </div>
  );
}
