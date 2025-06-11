// pages/test/tooltip-test.tsx
import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';

export default function TooltipTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Tooltip.Provider delayDuration={150}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="p-2 bg-white border rounded shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Info className="w-6 h-6 text-gray-600" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              sideOffset={5}
              className="bg-black text-white px-3 py-2 rounded text-sm shadow z-50"
            >
              Tooltip funktioniert! 🎉
              <Tooltip.Arrow className="fill-black" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
