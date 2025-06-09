import { useEffect, useState } from "react";

const COOKIE_NAME = "cookie_consent";

const defaultConsent = {
  essential: true,
  statistics: false,
  marketing: false,
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState(defaultConsent);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_NAME);
    if (!saved) setVisible(true);
  }, []);

  const handleAcceptAll = () => {
    const allConsent = {
      essential: true,
      statistics: true,
      marketing: true,
    };
    localStorage.setItem(COOKIE_NAME, JSON.stringify(allConsent));
    setConsent(allConsent);
    setVisible(false);
  };

  const handleSave = () => {
    localStorage.setItem(COOKIE_NAME, JSON.stringify(consent));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-xl z-50 p-4 border-t border-gray-200">
      <div className="max-w-4xl mx-auto text-sm text-gray-800">
        <p className="mb-2">
          Wir verwenden Cookies, um unsere Website zu verbessern. Du kannst selbst
          entscheiden, welche Kategorien du zulässt. Essenzielle Cookies sind immer aktiv.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked disabled className="accent-black" /> Essenziell
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={consent.statistics}
              onChange={(e) =>
                setConsent({ ...consent, statistics: e.target.checked })
              }
              className="accent-blue-500"
            />
            Statistik
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={consent.marketing}
              onChange={(e) =>
                setConsent({ ...consent, marketing: e.target.checked })
              }
              className="accent-red-500"
            />
            Marketing
          </label>
        </div>

        <div className="flex flex-col md:flex-row gap-2 justify-end">
          <button
            onClick={handleSave}
            className="bg-gray-200 text-sm px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Auswahl speichern
          </button>
          <button
            onClick={handleAcceptAll}
            className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}

export function hasConsent(category: keyof typeof defaultConsent): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(COOKIE_NAME);
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    return parsed[category] === true;
  } catch {
    return false;
  }
}
