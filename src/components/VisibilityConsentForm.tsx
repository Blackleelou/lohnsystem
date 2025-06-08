// src/components/VisibilityConsentForm.tsx

import { useState, useEffect } from 'react';

interface VisibilityConsentFormProps {
  // callback, der aufgerufen wird, wenn der Nutzer seine Auswahl bestätigt hat
  onSubmit: (consent: { showName: boolean; showEmail: boolean; showNickname: boolean }) => void;
}

export default function VisibilityConsentForm({ onSubmit }: VisibilityConsentFormProps) {
  const [showName, setShowName] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showNickname, setShowNickname] = useState(false);

  // Optional: Falls du beim Laden schon irgendwelche Defaults aus sessionStorage o. Ä. holen möchtest,
  // kannst du das hier machen. Für den minimalen Fall reicht aber das initiale State.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ showName, showEmail, showNickname });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-lg font-semibold">Welche Daten sollen angezeigt werden?</h2>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showName}
          onChange={(e) => setShowName(e.target.checked)}
          className="h-4 w-4"
        />
        <span>Name anzeigen</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showEmail}
          onChange={(e) => setShowEmail(e.target.checked)}
          className="h-4 w-4"
        />
        <span>E-Mail-Adresse anzeigen</span>
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showNickname}
          onChange={(e) => setShowNickname(e.target.checked)}
          className="h-4 w-4"
        />
        <span>Nickname anzeigen</span>
      </label>

      <button
        type="submit"
        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        Speichern
      </button>
    </form>
  );
}
