import { ReactElement, useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Trash2 } from 'lucide-react';
import UserSettingsLayout from '@/components/user/UserSettingsLayout';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [showName, setShowName] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showNickname, setShowNickname] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setNickname(session.user.nickname || '');
      setShowName(session.user.showName ?? true);
      setShowEmail(session.user.showEmail ?? false);
      setShowNickname(session.user.showNickname ?? false);
    }
  }, [session]);

  const saveChanges = async () => {
    setSaving(true);
    setSuccessMessage('');
    const res = await fetch('/api/user/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, nickname, showName, showEmail, showNickname }),
    });

    if (res.ok) {
      await update();
      setSuccessMessage('✅ Profil gespeichert');
      setTimeout(() => setSuccessMessage(''), 2500);
    } else {
      setSuccessMessage('❌ Fehler beim Speichern');
      setTimeout(() => setSuccessMessage(''), 3000);
    }

    setSaving(false);
  };

  const deleteAccount = async () => {
    const res = await fetch('/api/user/delete', { method: 'DELETE' });
    if (res.ok) {
      signOut({ callbackUrl: '/' });
    } else {
      alert('Fehler beim Löschen des Accounts');
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 px-2 space-y-6 relative">
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded shadow z-50 text-sm">
          {successMessage}
        </div>
      )}

      <h1 className="text-2xl font-semibold text-center">Profil Einstellungen</h1>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 p-4 space-y-4 text-sm">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Max Mustermann"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Nickname</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="z.B. ChrisJ"
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-2">Sichtbarkeit im Team</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showName} onChange={(e) => setShowName(e.target.checked)} />
              <span>Name</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showNickname}
                onChange={(e) => setShowNickname(e.target.checked)}
                disabled={!nickname}
              />
              <span>Nickname</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={showEmail} onChange={(e) => setShowEmail(e.target.checked)} />
              <span>E-Mail</span>
            </label>
          </div>
        </div>

        <button
          onClick={saveChanges}
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded mt-4 transition disabled:opacity-50"
        >
          {saving ? 'Speichern…' : 'Änderungen speichern'}
        </button>
      </div>

      {/* Account löschen */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-800 dark:text-gray-200">Account löschen</span>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition"
          >
            <Trash2 className="w-4 h-4" />
            Löschen
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Account wirklich löschen?
            </h3>
            <p className="text-sm text-red-500 mb-4">
              Willst du deinen Account dauerhaft löschen? Das kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={deleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded px-3 py-1 transition"
              >
                Ja, löschen
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium rounded px-3 py-1 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <UserSettingsLayout>{page}</UserSettingsLayout>;
};
