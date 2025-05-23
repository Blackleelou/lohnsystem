// components/Board/FormPanel.tsx

import React from "react";

type FormPanelProps = {
  isEditing: boolean;
  title: string;
  status: string;
  category: string[];
  notes: string;
  onChangeTitle: (val: string) => void;
  onChangeStatus: (val: string) => void;
  onChangeCategory: (val: string[]) => void;
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
  const toggleCategory = (value: string) => {
    if (category.includes(value)) {
      onChangeCategory(category.filter(c => c !== value));
    } else {
      onChangeCategory([...category, value]);
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-4 rounded shadow-sm mb-6">
      <h2 className="text-md font-semibold text-gray-800 mb-2">
        {isEditing ? "Eintrag bearbeiten" : "Manuellen Eintrag hinzufügen"}
      </h2>
      <div className="grid grid-cols-1 gap-4 mb-3">
        <input
          placeholder="Titel"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          className="border px-2 py-1 text-sm rounded w-full"
        />

        <div>
          <p className="font-medium text-sm mb-1 text-gray-700">Status</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => onChangeStatus(opt)}
                className={`px-3 py-1 rounded border text-sm ${status === opt ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium text-sm mb-1 text-gray-700">Kategorie</p>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => toggleCategory(opt)}
                className={`px-3 py-1 rounded border text-sm ${category.includes(opt) ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
              >
                {opt}
              </button>
            ))}
          </div>
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
