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
  hideImport?: boolean;
  hideExport?: boolean;
};

export default function FilterPanel({
  filteredEntries,
  selectedStatuses,
  selectedCategories,
  uniqueStatuses,
  uniqueCategories,
  setSelectedStatuses,
  setSelectedCategories,
  fileInputRef,
  handleUpload,
  hideImport = false,
  hideExport = false,
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

    updater(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  const statusOrder = ["geplant", "offen", "in Bearbeitung", "fertig/getestet"];
  const categoryOptions = [
    "IT", "Personal", "Finanzen", "Organisation", "Kommunikation", "Projekte", "Sonstiges",
  ];

  return (
    <div className="mb-6 bg-white border border-gray-200 p-4 rounded-md shadow-sm">
      {( !hideImport || !hideExport ) && (
        <div className="flex flex-wrap gap-4 items-center mb-4">
          {!hideImport && (
            <>
              <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Datei auswählen & importieren
              </label>
            </>
          )}

          {!hideExport && (
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Als JSON exportieren
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        <div>
          <p className="font-medium text-sm mb-2 text-gray-700">Status-Filter</p>
          <div className="flex gap-2 flex-wrap">
            {statusOrder.map((s) =>
              s === "fertig/getestet" ? (
                <button
                  key={s}
                  onClick={() => toggleCheckbox(s, "status")}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    selectedStatuses.includes("fertig") || selectedStatuses.includes("getestet")
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ) : (
                <button
                  key={s}
                  onClick={() => toggleCheckbox(s, "status")}
                  className={`px-3 py-1 rounded-md border text-sm ${
                    selectedStatuses.includes(s)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <p className="font-medium text-sm mb-2 text-gray-700">Kategorie-Filter</p>
          <div className="flex gap-2 flex-wrap">
            {categoryOptions.map((c) => (
              <button
                key={c}
                onClick={() => toggleCheckbox(c.toLowerCase(), "category")}
                className={`px-3 py-1 rounded-md border text-sm ${
                  selectedCategories.includes(c.toLowerCase())
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
