// components/Board/FormPanel.tsx

import React from "react";

type FormPanelProps = {
  isEditing: boolean;
  title: string;
  status: string;
  category: string;
  notes: string;
  onChangeTitle: (val: string) => void;
  onChangeStatus: (val: string) => void;
  onChangeCategory: (val: string) => void;
  onChangeNotes: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

const statusOptions = ["geplant", "offen", "in Bearbeitung", "fertig"];
const categoryOptions = ["IT", "Personal", "Finanzen", "Organisation", "Kommunikation", "Projekte", "Sonstiges"];

export default function FormPanel({
  isEditing,
  title,
  status,
  category,
  notes,
  onChangeTitle,
  onChangeStatus,
  onChangeCategory,
  onChangeNotes,
  onSave,
  onCancel,
}: FormPanelProps) {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded shadow-sm mb-6">
      <h2 className="text-md font-semibold text-gray-800 mb-2">
        {isEditing ? "Eintrag bearbeiten" : "Manuellen Eintrag hinzufügen"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
        <input
          placeholder="Titel"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          className="border px-2 py-1 text-sm rounded w-full"
        />

        {/* Status Auswahl */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`px-3 py-1 text-sm rounded border ${
                status === opt
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => onChangeStatus(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Kategorie Auswahl */}
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-3 py-1 text-sm rounded border ${
                category === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => onChangeCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          placeholder="Notizen"
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          className="border px-2 py-1 text-sm rounded w-full"
        />
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <button onClick={onSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded">
            Speichern
          </button>
          <button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm rounded">
            Abbrechen
          </button>
        </div>
      ) : (
        <button onClick={onSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded">
          Hinzufügen
        </button>
      )}
    </div>
  );
}
