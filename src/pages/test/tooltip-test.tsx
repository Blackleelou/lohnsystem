import { useEffect, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function TooltipTestPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold">Tooltip Testseite</h1>
        <p className="text-gray-600">Hier testen wir einen Tooltip auf einer isolierten Seite.</p>

        {mounted && (
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Hover mich
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-black text-white px-2 py-1 rounded text-xs shadow"
                  side="top"
                  sideOffset={5}
                >
                  Das ist ein Tooltip! 🎉
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        )}
      </div>
    </div>
  );
}
