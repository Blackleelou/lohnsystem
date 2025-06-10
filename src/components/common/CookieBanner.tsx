import { useEffect, useState } from "react";

const defaultConsent = {
  essenziell: true,
  statistik: false,
  marketing: false,
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState(defaultConsent);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function saveConsent(newConsent: typeof defaultConsent) {
    localStorage.setItem("cookie-consent", JSON.stringify(newConsent));
    setVisible(false);
    setModalOpen(false);
    location.reload(); // Reload, um Tracking-Skripte ggf. zu aktivieren
  }

  function handleAcceptAll() {
    saveConsent({ essenziell: true, statistik: true, marketing: true });
  }

  function handleDeclineAll() {
    saveConsent({ essenziell: true, statistik: false, marketing: false });
  }

  function handleSaveSelection() {
    saveConsent(consent);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 shadow-md z-50 text-sm">
      {!modalOpen ? (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            Wir verwenden Cookies, um unsere Website zu verbessern. Einige sind essenziell, andere helfen uns,
            z. B. bei Statistik oder Marketing.{" "}
            <a href="/legal" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">
              Mehr erfahren
            </a>
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setModalOpen(true)}>
              Auswahl ansehen
            </button>
            <button className="px-4 py-2 rounded bg-gray-100" onClick={handleDeclineAll}>
              Nur essenzielle
            </button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleAcceptAll}>
              Alle akzeptieren
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border p-4 mt-4 rounded">
          <h2 className="font-semibold mb-2">Cookie-Einstellungen</h2>
          <label className="block mb-2">
            <input type="checkbox" checked disabled /> Essenziell (immer aktiv)
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              checked={consent.statistik}
              onChange={(e) => setConsent({ ...consent, statistik: e.target.checked })}
            />{" "}
            Statistik (z. B. Google Analytics)
          </label>
          <label className="block mb-4">
            <input
              type="checkbox"
              checked={consent.marketing}
              onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
            />{" "}
            Marketing (z. B. Werbung, Retargeting)
          </label>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setModalOpen(false)}>
              Zurück
            </button>
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSaveSelection}>
              Auswahl speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
