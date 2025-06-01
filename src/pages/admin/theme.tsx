import { useEffect, useState } from "react";
import ThemeSelector, { ThemeSettings } from "@/components/admin/ThemeSelector";

// Hilfsfunktion, um Theme-Settings vom Server zu holen
async function fetchSettings(): Promise<ThemeSettings> {
  const res = await fetch("/api/company/settings");
  if (!res.ok) throw new Error("Fehler beim Laden der Einstellungen");
  const data = await res.json();
  return data.settings;
}

// Hilfsfunktion, um Theme-Settings zu speichern
async function saveSettings(settings: ThemeSettings): Promise<ThemeSettings> {
  const res = await fetch("/api/company/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Fehler beim Speichern der Einstellungen");
  const data = await res.json();
  return data.settings;
}

export default function AdminThemePage() {
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then(s => {
        setSettings(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave(newSettings: ThemeSettings) {
    setSaving(true);
    await saveSettings(newSettings);
    setSettings(newSettings);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }

  if (loading) return <div className="p-8 text-center">Lade Theme-Einstellungen…</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Design & Theme verwalten</h1>
      <ThemeSelector settings={settings!} onSave={handleSave} />
      {saving && <div className="text-blue-600 text-center mt-4">Wird gespeichert…</div>}
      {success && <div className="text-green-600 text-center mt-4">Theme gespeichert!</div>}
    </div>
  );
}
