import { useState } from "react";
import { THEMES } from "@/lib/themes";

export type ThemeSettings = {
  themeName?: string;
  useCustomColors?: boolean;
  primaryColor?: string;
  accentColor?: string;
  bgLight?: string;
  bgDark?: string;
  textColor?: string;
};

interface ThemeSelectorProps {
  settings?: ThemeSettings;
  onSave: (data: ThemeSettings) => void;
}

const colorLabels: Record<string, string> = {
  primaryColor: "Hauptfarbe",
  accentColor: "Akzentfarbe",
  bgLight: "Hintergrund hell",
  bgDark: "Hintergrund dunkel",
  textColor: "Textfarbe",
};

const colorHelps: Record<string, string> = {
  primaryColor: "Farbe für Buttons und wichtige Elemente.",
  accentColor: "Zweite Akzentfarbe für Hervorhebungen.",
  bgLight: "Hintergrundfarbe im hellen Modus.",
  bgDark: "Hintergrundfarbe im dunklen Modus.",
  textColor: "Farbe für Texte.",
};

export default function ThemeSelector({ settings, onSave }: ThemeSelectorProps) {
  const [selected, setSelected] = useState<string>(settings?.themeName || "classic-duo");
  const [useCustom, setUseCustom] = useState<boolean>(settings?.useCustomColors || false);
  const [custom, setCustom] = useState({
    primaryColor: settings?.primaryColor || "#2563eb",
    accentColor: settings?.accentColor || "#1e40af",
    bgLight: settings?.bgLight || "#f9fafb",
    bgDark: settings?.bgDark || "#2e3440",
    textColor: settings?.textColor || "#111827",
  });

  // Theme wechseln
  function handleSelect(themeName: string) {
    setSelected(themeName);
    setUseCustom(false);
  }

  // Input-Felder ändern
  function handleCustomChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCustom({ ...custom, [e.target.name]: e.target.value });
    setUseCustom(true);
    setSelected("custom");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (useCustom) {
      onSave({ themeName: "custom", useCustomColors: true, ...custom });
    } else {
      const theme = THEMES.find(t => t.name === selected);
      onSave({ themeName: selected, useCustomColors: false, ...theme });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-xl font-bold mb-4">Theme auswählen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEMES.map(theme => (
          <button
            type="button"
            key={theme.name}
            className={`p-3 rounded-lg border-2 ${selected === theme.name && !useCustom ? "border-blue-600" : "border-transparent"} flex flex-col items-start`}
            style={{
              background: theme.bgLight,
              color: theme.textColor,
              borderColor: selected === theme.name && !useCustom ? theme.primaryColor : undefined,
            }}
            onClick={() => handleSelect(theme.name)}
          >
            <span className="font-bold" style={{ color: theme.primaryColor }}>{theme.displayName}</span>
            <span className="text-xs">{theme.style}</span>
            <div className="flex gap-2 mt-2">
              <span style={{ background: theme.primaryColor }} className="inline-block w-5 h-5 rounded"></span>
              <span style={{ background: theme.accentColor }} className="inline-block w-5 h-5 rounded"></span>
              <span style={{ background: theme.bgLight, border: "1px solid #eee" }} className="inline-block w-5 h-5 rounded"></span>
              <span style={{ background: theme.bgDark }} className="inline-block w-5 h-5 rounded"></span>
            </div>
          </button>
        ))}
        <button
          type="button"
          className={`p-3 rounded-lg border-2 ${useCustom ? "border-green-600" : "border-transparent"} flex flex-col items-start bg-gray-50`}
          onClick={() => { setUseCustom(true); setSelected("custom"); }}
        >
          <span className="font-bold text-green-700">Eigenes Theme</span>
          <span className="text-xs">Farben frei definieren</span>
        </button>
      </div>

      {useCustom && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(colorLabels).map(field => (
            <label key={field} className="flex flex-col gap-1">
              <span className="font-semibold">{colorLabels[field]}</span>
              <span className="text-xs text-gray-500">{colorHelps[field]}</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  name={field}
                  type="color"
                  value={custom[field as keyof typeof custom] || "#ffffff"}
                  onChange={handleCustomChange}
                  className="w-10 h-7 p-0 border rounded shadow"
                />
                {/* Live-Vorschau für diese Farbe */}
                {field === "primaryColor" && (
                  <span
                    className="px-2 py-1 rounded text-white text-xs"
                    style={{ background: custom.primaryColor }}
                  >
                    Button
                  </span>
                )}
                {field === "accentColor" && (
                  <span
                    className="px-2 py-1 rounded text-white text-xs"
                    style={{ background: custom.accentColor }}
                  >
                    Akzent
                  </span>
                )}
                {field === "bgLight" && (
                  <span
                    className="px-2 py-1 rounded text-gray-700 text-xs border"
                    style={{ background: custom.bgLight }}
                  >
                    Hintergrund hell
                  </span>
                )}
                {field === "bgDark" && (
                  <span
                    className="px-2 py-1 rounded text-gray-100 text-xs border"
                    style={{ background: custom.bgDark }}
                  >
                    Hintergrund dunkel
                  </span>
                )}
                {field === "textColor" && (
                  <span
                    className="px-2 py-1 rounded text-xs border"
                    style={{ color: custom.textColor, borderColor: "#ccc" }}
                  >
                    Text
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>
      )}

      <button type="submit" className="btn-primary w-full mt-4">
        Speichern
      </button>
    </form>
  );
}
