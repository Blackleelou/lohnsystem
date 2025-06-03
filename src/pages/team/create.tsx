// src/pages/team/create.tsx

import Layout from "@/components/common/Layout";
import { useState } from "react";
import { useRouter } from "next/router";

export default function TeamCreatePage() {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Hier später echten API-Call zum Erstellen!
    setTimeout(() => {
      setSaving(false);
      // Nach erfolgreicher Erstellung weiterleiten (Demo)
      router.push("/dashboard?created=1");
    }, 1200);
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-8 mt-12 bg-white dark:bg-gray-900 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Team erstellen</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Teamname</label>
            <input
              className="w-full px-3 py-2 border rounded"
              placeholder="z.B. Betriebsrat Nachtschicht"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Beschreibung (optional)</label>
            <input
              className="w-full px-3 py-2 border rounded"
              placeholder="(optional) Wofür nutzt ihr das Team?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
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
