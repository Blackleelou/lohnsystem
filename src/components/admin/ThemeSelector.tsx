import { useState, useEffect } from "react";
import { THEMES, Theme } from "@/lib/themes";

export default function ThemeSelector({ settings, onSave }) {
  // settings = aktuelle Theme-Settings vom Server (Prop)
  const [selected, setSelected] = useState<string>(settings?.themeName || "classic-duo");
  const [useCustom, setUseCustom] = useState<boolean>(settings?.useCustomColors || false);
  const [custom, setCustom] = useState({
    primaryColor: settings?.primaryColor || "",
    accentColor: settings?.accentColor || "",
    bgLight: settings?.bgLight || "",
    bgDark: settings?.bgDark || "",
    textColor: settings?.textColor || "",
  });

  // Theme wechseln
  function handleSelect(themeName: string) {
    setSelected(themeName);
    setUseCustom(false);
  }

  // Input-Felder ändern
  function handleCustomChange(e) {
    setCustom({ ...custom, [e.target.name]: e.target.value });
    setUseCustom(true);
  }

  function handleSubmit(e) {
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
          {["primaryColor", "accentColor", "bgLight", "bgDark", "textColor"].map(field => (
            <label key={field} className="flex flex-col">
              {field}
              <input
                name={field}
                type="color"
                value={custom[field] || "#ffffff"}
                onChange={handleCustomChange}
                className="w-16 h-8 p-0 border-none"
              />
            </label>
          ))}
        </div>
      )}

      <button type="submit" className="btn-primary w-full">
        Speichern
      </button>
    </form>
  );
}
