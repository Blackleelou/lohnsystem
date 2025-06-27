import { Info } from 'lucide-react';
import React from 'react';

export default function Tooltip({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span className="group relative inline-flex items-center cursor-pointer text-gray-400">
      {icon ?? <Info className="w-4 h-4" />}
      <span
        className="pointer-events-none absolute z-50 hidden group-hover:block
          bg-white border border-gray-200 rounded px-3 py-2 text-xs text-gray-700 shadow-lg w-64
          top-6 left-1/2 -translate-x-1/2
          opacity-0 group-hover:opacity-100
          transition-opacity transition-transform duration-200 ease-out
          delay-200 group-hover:delay-0
          transform group-hover:translate-y-0 translate-y-1"
      >
        {children}
      </span>
    </span>
  );
}
