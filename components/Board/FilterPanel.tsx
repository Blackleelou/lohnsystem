import { STATUS_OPTIONS } from "./constants";

// ...

<p className="font-medium text-sm mb-2 text-gray-700">Status-Filter</p>
<div className="flex gap-2 flex-wrap">
  {[...STATUS_OPTIONS]
    .filter(
      (s) =>
        s !== "fertig" &&
        s !== "getestet" &&
        s !== "fertig/getestet"
    )
    .map((s) => (
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

  <button
    onClick={() => toggleCheckbox("fertig/getestet", "status")}
    className={`px-3 py-1 rounded-md text-sm border ${
      selectedStatuses.includes("fertig") ||
      selectedStatuses.includes("getestet")
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    fertig/getestet
  </button>
</div>
