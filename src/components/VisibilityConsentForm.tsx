import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface VisibilityConsentFormProps {
  onSubmit: (consent: {
    nickname: string;
    realname?: string;
    showName: boolean;
    showEmail: boolean;
    showNickname: boolean;
  }) => void;
}

export default function VisibilityConsentForm({ onSubmit }: VisibilityConsentFormProps) {
  const { data: session } = useSession();
  const [nickname, setNickname] = useState('');
  const [realname, setRealname] = useState('');
  const [showName, setShowName] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showNickname, setShowNickname] = useState(false);
  const [shouldAskRealname, setShouldAskRealname] = useState(false);

  // Prüfen, ob der Nutzer einen Namen hat
  useEffect(() => {
    if (!session?.user?.name || session.user.name.trim() === '') {
      setShouldAskRealname(true);
    }
  }, [session]);

  const handleNicknameChange = (val: string) => {
    setNickname(val);
    setShowNickname(!!val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nickname, realname, showName, showEmail, showNickname });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-6"
    >
      {shouldAskRealname && (
  <div>
    <label className="block text-sm font-semibold mb-1">
      Dein Name <span className="text-gray-400">(optional)</span>
    </label>
    <input
      className="w-full px-3 py-2 border rounded"
      placeholder="z.B. Max Mustermann"
      value={realname}
      onChange={(e) => setRealname(e.target.value)}
      maxLength={50}
    />
    <span className="block mt-1 text-xs text-gray-500">
      Optional: Wenn du deinen echten Namen angibst, können andere Teammitglieder dich leichter erkennen.
      Du kannst später entscheiden, ob dein Name im Team sichtbar sein soll.
    </span>
  </div>
)}

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
