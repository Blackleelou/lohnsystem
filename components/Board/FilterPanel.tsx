// components/Board/FilterPanel.tsx

import React, { MutableRefObject, ChangeEvent } from "react";
import { Entry } from "./types";

type FilterPanelProps = {
  filteredEntries: Entry[];
  selectedStatuses: string[];
  selectedCategories: string[];
  uniqueStatuses: string[];
  uniqueCategories: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  fileInputRef: MutableRefObject<HTMLInputElement | null>;
  handleUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
};

const fixedCategories = [
  "IT",
  "Personal",
  "Finanzen",
  "Organisation",
  "Kommunikation",
  "Projekte",
  "Sonstiges",
];

export default function FilterPanel({
  filteredEntries,
  selectedStatuses,
  selectedCategories,
  uniqueStatuses,
  setSelectedStatuses,
  setSelectedCategories,
  fileInputRef,
  handleUpload,
}: FilterPanelProps) {
  const toggleCheckbox = (value: string, group: "status" | "category") => {
    const current = group === "status" ? selectedStatuses : selectedCategories;
    const updater = group === "status" ? setSelectedStatuses : setSelectedCategories;

    if (group === "status" && value === "fertig/getestet") {
      const updated = current.includes("fertig") || current.includes("getestet")
        ? current.filter((s) => s !== "fertig" && s !== "getestet")
        : [...current, "fertig", "getestet"];
      updater(updated);
      return;
    }

    updater(current.includes(value) ? current.filter(v => v !== value) : [...current, value]);
  };

  return (
    <div className="mb-6 bg-white border border-gray-200 p-4 rounded shadow-sm">
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <input type="file" accept=".json" ref={fileInputRef} onChange={handleUpload} className="hidden" id="fileUpload" />
        <label htmlFor="fileUpload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
          Datei auswählen & importieren
        </label>
        <button
          onClick={() => {
            const data = JSON.stringify(filteredEntries, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Export_ToDo_${new Date().toISOString().replace(/[:.]/g, "_")}.json`;
            a.click();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Als JSON exportieren
        </button>
      </div>

      <div className="flex gap-6 flex-wrap">
        <div>
          <p className="font-medium text-sm mb-1 text-gray-700">Status-Filter</p>
          <div className="flex gap-2 flex-wrap">
            {[...new Set(uniqueStatuses.filter(s =>
              s !== "fertig" &&
              s !== "getestet" &&
              s !== "fertig/getestet"
            ))].map((s) => (
              <label key={s} className="text-sm flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(s)}
                  onChange={() => toggleCheckbox(s, "status")}
                />
                {s}
              </label>
            ))}

            <label className="text-sm flex items-center gap-1">
              <input
                type="checkbox"
                checked={
                  selectedStatuses.includes("fertig") || selectedStatuses.includes("getestet")
                }
                onChange={() => toggleCheckbox("fertig/getestet", "status")}
              />
              fertig/getestet
            </label>
          </div>
        </div>

        <div>
          <p className="font-medium text-sm mb-1 text-gray-700">Kategorie-Filter</p>
          <div className="flex gap-2 flex-wrap">
            {fixedCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCheckbox(cat.toLowerCase(), "category")}
                className={`px-3 py-1 text-sm rounded-full border ${
                  selectedCategories.includes(cat.toLowerCase())
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
