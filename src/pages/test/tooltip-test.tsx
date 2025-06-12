import { Info } from "lucide-react";

export default function TooltipTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-sm text-center">
        <h1 className="text-xl font-bold mb-4">Tooltip Test</h1>
        <div className="flex justify-center items-center gap-2">
          <span>Was bedeutet das?</span>

          {/* Tooltip Container */}
          <div className="relative group cursor-pointer text-gray-600">
            <Info className="w-5 h-5" />

            {/* Tooltip-Text */}
            <span className="absolute z-50 hidden group-hover:block bg-black text-white px-3 py-1 rounded text-xs shadow-md w-56 top-6 left-1/2 -translate-x-1/2">
              Dies ist ein einfacher Tooltip mit Tailwind CSS und funktioniert auch mobil!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
