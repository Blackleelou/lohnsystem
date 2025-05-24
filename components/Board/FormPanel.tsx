import React from "react";
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from "./constants";

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
    onChangeCategory(
      category.includes(value)
        ? category.filter((c) => c !== value)
        : [...category, value]
    );
  };

  const statusOrder = ["offen", "geplant", "in Bearbeitung", "getestet", "fertig"];

  return (
    <div className="bg-white border border-gray-200 p-4 rounded shadow-sm mb-6">
      <h2 className="text-md font-semibold text-gray-800 mb-4">
        {isEditing ? "Eintrag bearbeiten" : "Manuellen Eintrag hinzufügen"}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <input
          placeholder="Titel"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          className="border px-3 py-2 text-sm rounded w-full"
        />

        <div>
          <p className="font-medium text-sm text-gray-700 mb-1">Status</p>
          <div className="flex flex-wrap gap-2">
            {statusOrder.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChangeStatus(opt)}
                className={`px-3 py-1 rounded border text-sm transition ${
                  status === opt
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium text-sm text-gray-700 mb-1">Kategorie</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleCategory(opt)}
                className={`px-3 py-1 rounded border text-sm transition ${
                  category.includes(opt)
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
          placeholder="Notizen"
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          className="border px-3 py-2 text-sm rounded w-full"
        />
      </div>

      <div className="flex gap-2 mt-4">
        {isEditing ? (
          <>
            <button
              onClick={onSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded"
            >
              Speichern
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm rounded"
            >
              Abbrechen
            </button>
          </>
        ) : (
          <button
            onClick={onSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded"
          >
            Hinzufügen
          </button>
        )}
      </div>
    </div>
  );
}
