import { useState } from 'react';

interface VisibilityConsentFormProps {
  onSubmit: (consent: {
    nickname: string;
    showName: boolean;
    showEmail: boolean;
    showNickname: boolean;
  }) => void;
}

export default function VisibilityConsentForm({ onSubmit }: VisibilityConsentFormProps) {
  const [nickname, setNickname] = useState('');
  const [showName, setShowName] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showNickname, setShowNickname] = useState(false);

  const handleNicknameChange = (val: string) => {
    setNickname(val);
    setShowNickname(!!val); // Automatisch aktivieren, wenn Nickname vorhanden
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nickname, showName, showEmail, showNickname });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-6"
    >
      <div>
        <label className="block text-sm font-semibold mb-1">
          Nickname <span className="text-gray-400">(optional)</span>
        </label>
        <input
          className="w-full px-3 py-2 border rounded"
          placeholder="z.B. ChrisJ, NightshiftPro, etc."
          value={nickname}
          onChange={(e) => handleNicknameChange(e.target.value)}
          maxLength={32}
        />
        <span className="block mt-1 text-xs text-gray-500">
          Dein Nickname wird angezeigt, falls du es erlaubst. Du kannst ihn später ändern.
        </span>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <label className="block font-semibold mb-2">
          Was dürfen andere im Team von dir sehen?
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showName}
              onChange={(e) => setShowName(e.target.checked)}
            />
            <span>Name</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showNickname}
              onChange={(e) => setShowNickname(e.target.checked)}
              disabled={!nickname}
            />
            <span>Nickname (falls hinterlegt)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showEmail}
              onChange={(e) => setShowEmail(e.target.checked)}
            />
            <span>E-Mail-Adresse</span>
          </label>
          <span className="text-xs text-gray-500">
            Du kannst deine Einstellungen später jederzeit ändern.
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        Speichern & Team beitreten
      </button>
    </form>
  );
}
