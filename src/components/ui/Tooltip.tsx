import { Info } from 'lucide-react';

export default function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span className="group relative cursor-pointer text-gray-400">
      <Info className="w-4 h-4" />
      <span className="absolute z-50 hidden group-hover:block bg-white border rounded px-3 py-2 text-xs text-gray-700 shadow-lg w-64 top-6 left-1/2 -translate-x-1/2">
        {children}
      </span>
    </span>
  );
}
