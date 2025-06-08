// components/Board/EntryModal.tsx

import { Entry } from './types';

type EntryModalProps = {
  entry: Entry;
  onClose: () => void;
};

export default function EntryModal({ entry, onClose }: EntryModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="Schließen"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{entry.title}</h2>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Kategorie:</strong> {entry.category}
        </p>
        <p className="text-sm text-gray-600 mb-3">
          <strong>Status:</strong> {entry.status}
        </p>
        {entry.notes && <p className="text-sm text-gray-700 mb-3">{entry.notes}</p>}
        <p className="text-xs text-gray-400">
          Erstellt: {new Date(entry.createdAt).toLocaleString()}
          {entry.completedAt && (
            <>
              <br />
              Fertig: {new Date(entry.completedAt).toLocaleString()}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
