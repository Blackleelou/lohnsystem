import Layout from "@/components/common/Layout";
import { useState } from "react";
import { useRouter } from "next/router";

export default function TeamCreatePage() {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [showName, setShowName] = useState(true);
  const [showNickname, setShowNickname] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: teamName,
        description,
        showName,
        showNickname,
        showEmail,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/team/${data.teamId}`);
    } else {
      alert("Fehler beim Anlegen: " + (await res.text()));
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6 mt-8 bg-white dark:bg-gray-900 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Team erstellen</h1>
        {/* ...Teamname und Beschreibung wie bisher... */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... Name/Description ... */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Sichtbarkeit im Team
            </label>
            <div className="space-y-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showName}
                  onChange={e => setShowName(e.target.checked)}
                />
                Echter Name anzeigen
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showNickname}
                  onChange={e => setShowNickname(e.target.checked)}
                />
                Nickname/Pseudonym anzeigen
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showEmail}
                  onChange={e => setShowEmail(e.target.checked)}
                />
                E-Mail-Adresse anzeigen
              </label>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Wähle aus, wie Mitglieder im Team für andere sichtbar sind.
            </div>
          </div>

          {/* ...Submit-Button... */}
        </form>
      </div>
    </Layout>
  );
}
