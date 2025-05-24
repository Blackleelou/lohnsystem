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

    updater(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  };

  const categoryOptions = [
    "IT", "Personal", "Finanzen", "Organisation", "Kommunikation", "Projekte", "Sonstiges",
  ];

  const statusOrder = ["offen", "geplant", "in Bearbeitung", "getestet", "fertig"];

  return (
    <div className="mb-6 bg-white border border-gray-200 p-4 rounded shadow-sm">
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

      <div className="flex gap-6 flex-wrap">
        <div>
          <p className="font-medium text-sm mb-2 text-gray-700">Status-Filter</p>
          <div className="flex gap-2 flex-wrap">
            {statusOrder.map((s) => (
              <button
                key={s}
                onClick={() => toggleCheckbox(s, "status")}
                className={`px-3 py-1 rounded-md text-sm border ${
                  selectedStatuses.includes(s)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium text-sm mb-2 text-gray-700">Kategorie-Filter</p>
          <div className="flex gap-2 flex-wrap">
            {categoryOptions.map((c) => (
              <button
                key={c}
                onClick={() => toggleCheckbox(c.toLowerCase(), "category")}
                className={`px-3 py-1 rounded-md text-sm border ${
                  selectedCategories.includes(c.toLowerCase())
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
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
