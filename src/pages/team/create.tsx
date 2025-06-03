import Layout from "@/components/common/Layout";
import { useState } from "react";
import { useRouter } from "next/router";

export default function TeamCreatePage() {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [nickname, setNickname] = useState("");
  const [showName, setShowName] = useState(true);
  const [showNickname, setShowNickname] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: teamName,
        description,
        nickname,
        showName,
        showNickname: !!nickname && showNickname, // Falls Nickname leer, immer false!
        showEmail,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push("/team");
    } else {
      setError(await res.text());
      setSaving(false);
    }
  };

  // Nickname-Häkchen auto aktivieren/deaktivieren
  const handleNicknameChange = (val: string) => {
    setNickname(val);
    if (val) {
      setShowNickname(true);
    } else {
      setShowNickname(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6 mt-8 bg-white dark:bg-gray-900 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Team erstellen</h1>

        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded text-sm text-blue-900 dark:text-blue-200">
          <strong>Hinweis für Betriebsräte & Teamleiter:</strong><br />
          Benenne dein Team (z.B. „SchnelleLogistik Zwickau – Betriebsrat“), damit alle Kolleg:innen es leicht wiederfinden.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Firmen- oder Teamname
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              placeholder="z.B. SchnelleLogistik Zwickau – Betriebsrat"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              required
            />
            <span className="block mt-1 text-xs text-gray-500">
              Tipp: Offizieller Name oder Abteilung hilft beim Wiederfinden!
            </span>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Beschreibung <span className="text-gray-400">(optional)</span>
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              placeholder="z.B. Koordination der Fahrzeuglogistik im VW Werk Zwickau"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nickname <span className="text-gray-400">(optional)</span>
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              placeholder="z.B. ChrisJ, NightshiftPro, etc."
              value={nickname}
              onChange={e => handleNicknameChange(e.target.value)}
              maxLength={32}
            />
            <span className="block mt-1 text-xs text-gray-500">
              Dein Nickname wird angezeigt, falls du es erlaubst. Du kannst ihn später ändern.
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <label className="block font-semibold mb-2">
              Was dürfen andere im Team von dir sehen?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={showName} onChange={e => setShowName(e.target.checked)} />
                <span>Name</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showNickname}
                  onChange={e => setShowNickname(e.target.checked)}
                  disabled={!nickname}
                />
                <span>Nickname (falls hinterlegt)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={showEmail} onChange={e => setShowEmail(e.target.checked)} />
                <span>E-Mail-Adresse</span>
              </label>
              <span className="text-xs text-gray-500">
                Du kannst deine Einstellungen später jederzeit ändern.
              </span>
            </div>
          </div>
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={saving || !teamName}
            className="bg-violet-600 text-white px-6 py-2 rounded font-bold hover:bg-violet-700 transition disabled:opacity-60"
          >
            {saving ? "Wird angelegt..." : "Team erstellen"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
