import React, { useState } from 'react';
import { Entry } from './types';
import { STATUS_OPTIONS, CATEGORY_OPTIONS } from './constants';

type EntryCardProps = {
  entry: Entry;
  handleUpdate: (updated: Partial<Entry> & { id: string }) => void;
  handleDelete: (id: string) => void;
  onClick: () => void;
};

export default function EntryCard({ entry, handleUpdate, handleDelete, onClick }: EntryCardProps) {
  const isFertig = entry.status.toLowerCase() === 'fertig';

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: entry.title,
    status: entry.status,
    category: entry.category,
    notes: entry.notes || '',
  });

  const toggleCategory = (value: string) => {
    setEditData((prev) => ({
      ...prev,
      category: prev.category.includes(value)
        ? prev.category.filter((c) => c !== value)
        : [...prev.category, value],
    }));
  };

  const statusOrder = ['offen', 'geplant', 'in Bearbeitung', 'getestet', 'fertig'];

  const saveChanges = () => {
    handleUpdate({
      id: entry.id,
      title: editData.title,
      status: editData.status,
      category: editData.category,
      notes: editData.notes,
    });
    setIsEditing(false);
  };

  return (
    <div
      onClick={!isEditing ? onClick : undefined}
      className={`border p-4 rounded-md shadow-sm transition ${
        isFertig ? 'bg-green-50 border-green-200' : 'bg-white'
      }`}
    >
      {isEditing ? (
        <>
          <input
            className="w-full text-lg font-semibold text-gray-800 mb-3 border rounded-md px-2 py-1"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />

          <div className="mb-3">
            <p className="font-medium text-sm mb-1 text-gray-700">Status</p>
            <div className="flex flex-wrap gap-2">
              {statusOrder.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setEditData({ ...editData, status: opt })}
                  className={`px-3 py-1 rounded-md border text-sm transition ${
                    editData.status === opt
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  className={`px-3 py-1 rounded-md border text-sm transition ${
                    editData.category.includes(opt)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <input
            className="w-full border px-2 py-1 text-sm rounded-md mb-2"
            placeholder="Notizen"
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
          />

          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={saveChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md"
            >
              Speichern
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 text-sm rounded-md"
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
          <p className="text-sm text-gray-500">Kategorie: {entry.category.join(', ')}</p>
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
