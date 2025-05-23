import React from "react";

type FilterPanelProps = {
  statuses: string[];
  categories: string[];
  selectedStatuses: string[];
  selectedCategories: string[];
  onToggle: (value: string, group: "status" | "category") => void;
};

export default function FilterPanel({
  statuses,
  categories,
  selectedStatuses,
  selectedCategories,
  onToggle,
}: FilterPanelProps) {
  return (
    <div className="mb-6 bg-white border border-gray-200 p-4 rounded shadow-sm">
      <div className="flex gap-6 flex-wrap">
        <div>
          <p className="font-medium text-sm mb-1 text-gray-700">Status-Filter</p>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <label key={s} className="text-sm flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(s)}
                  onChange={() => onToggle(s, "status")}
                  className="accent-blue-600"
                />
                {s}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium text-sm mb-1 text-gray-700">Kategorie-Filter</p>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <label key={c} className="text-sm flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c)}
                  onChange={() => onToggle(c, "category")}
                  className="accent-blue-600"
                />
                {c}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
