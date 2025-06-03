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

  const res = await fetch("/api/team", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: teamName, description }),
  });

  if (res.ok) {
    // Erfolgreich: Weiter auf Dashboard/Einstellungen etc.
    router.push("/dashboard?created=1");
  } else {
    alert("Fehler beim Anlegen: " + (await res.text()));
    setSaving(false);
  }
};

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6 mt-8 bg-white dark:bg-gray-900 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Team erstellen</h1>

        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded text-sm text-blue-900 dark:text-blue-200">
          <strong>Hinweis für Betriebsräte & Teamleiter:</strong><br />
          Du kannst dein Team — z.B. <span className="font-semibold">„SchnelleLogistik Zwickau – Betriebsrat“</span> — so benennen, dass alle Kolleg:innen es leicht wiederfinden. <br />
          So kann euer Betriebsrat für alle zentrale Einstellungen vorgeben und die Kollegen müssen nur noch ihre Zeiten eintragen!
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
              Tipp: Gib den offiziellen Firmennamen, eine Abteilung oder z.B. <span className="italic">„VW Werk Zwickau – Fahrzeuglogistik Nachtschicht“</span> an, damit dein Team eindeutig gefunden wird.
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
