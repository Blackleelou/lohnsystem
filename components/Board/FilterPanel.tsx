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
  uploadResult: string | null;
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
  uploadResult,
}: FilterPanelProps) {
  const toggleCheckbox = (value: string, group: "status" | "category") => {
    const current = group === "status" ? selectedStatuses : selectedCategories;
    const updater = group === "status" ? setSelectedStatuses : setSelectedCategories;
    updater(current.includes(value) ? current.filter(v => v !== value) : [...current, value]);
  };

  const displayStatuses = Array.from(
    new Set(
      uniqueStatuses.map((s) =>
        ["getestet", "fertig"].includes(s) ? "fertig/getestet" : s
      )
    )
  );

  return (
    <div className="mb-6 bg-white border border-gray-200 p-4 rounded shadow-sm">
      <div className="flex flex-wrap gap-4 items-center mb-4">
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
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Datei auswählen & importieren
        </label>
        <button
          onClick={() => {
            const data = JSON.stringify(filteredEntries, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Export_ToDo_${new Date()
              .toISOString()
              .replace(/[:.]/g, "_")}.json`;
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
            {displayStatuses.map((s) => (
              <label key={s} className="text-sm flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={
                    s === "fertig/getestet"
                      ? selectedStatuses.includes("fertig") &&
                        selectedStatuses.includes("getestet")
                      : selectedStatuses.includes(s)
                  }
                  onChange={() => {
                    if (s === "fertig/getestet") {
                      const isActive =
                        selectedStatuses.includes("fertig") &&
                        selectedStatuses.includes("getestet");
                      setSelectedStatuses((prev) =>
                        isActive
                          ? prev.filter((v) => v !== "fertig" && v !== "getestet")
                          : [...prev, "fertig", "getestet"]
                      );
                    } else {
                      toggleCheckbox(s, "status");
                    }
                  }}
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="font-medium text-sm mb-1 text-gray-700">Kategorie-Filter</p>
          <div className="flex gap-2 flex-wrap">
            {uniqueCategories.map((c) => (
              <label key={c} className="text-sm flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c)}
                  onChange={() => toggleCheckbox(c, "category")}
                />
                {c}
              </label>
            ))}
          </div>
        </div>
      </div>

      {uploadResult && (
        <div className="mt-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded shadow">
          {uploadResult}
        </div>
      )}
    </div>
  );
}
