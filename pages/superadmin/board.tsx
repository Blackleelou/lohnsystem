import Layout from "@/components/Layout";
import { useState } from "react";

type Eintrag = {
  id: number;
  titel: string;
  status: "offen" | "inBearbeitung" | "erledigt";
  erstelltAm: string;
};

export default function SuperadminBoard() {
  const [eintraege, setEintraege] = useState<Eintrag[]>([]);
  const [titel, setTitel] = useState("");

  const handleAdd = () => {
    if (!titel.trim()) return;
    const neuerEintrag: Eintrag = {
      id: Date.now(),
      titel,
      status: "offen",
      erstelltAm: new Date().toISOString(),
    };
    setEintraege([neuerEintrag, ...eintraege]);
    setTitel("");
  };

  const toggleStatus = (id: number) => {
    setEintraege((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status:
                e.status === "offen"
                  ? "inBearbeitung"
                  : e.status === "inBearbeitung"
                  ? "erledigt"
                  : "offen",
            }
          : e
      )
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Superadmin: Tagebuch & ToDo-Board</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={titel}
            onChange={(e) => setTitel(e.target.value)}
            placeholder="Neuer Punkt z. B. 'Importfunktion anpassen'"
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Hinzufügen
          </button>
        </div>

        {eintraege.length === 0 && (
          <p className="text-gray-500">Noch keine Einträge vorhanden.</p>
        )}

        <ul className="space-y-2">
          {eintraege.map((e) => (
            <li
              key={e.id}
              className="p-3 rounded border shadow bg-white flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{e.titel}</p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span className="font-semibold capitalize">{e.status}</span>
                </p>
              </div>
              <button
                onClick={() => toggleStatus(e.id)}
                className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Status ändern
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
