import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import Link from "next/link";

export default function TooltipTestPage() {
  const [log, setLog] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <h1 className="text-2xl font-bold mb-6">🔍 Tooltip-Test</h1>

      <table className="w-full max-w-xl text-sm border rounded bg-white shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Aktion</th>
            <th className="px-4 py-2 text-left">Tooltip</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="px-4 py-2">
              <Link
                href="/team/print/test-token?edit=1"
                className="text-violet-600 hover:underline"
                onClick={() => setLog((prev) => [...prev, "Bearbeiten geklickt"])}
              >
                ✏️ Bearbeiten
              </Link>
            </td>
            <td className="px-4 py-2">
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span className="cursor-help text-gray-700">ℹ️</span>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      sideOffset={8}
                      className="bg-black text-white px-2 py-1 rounded text-xs shadow"
                    >
                      Einladung bearbeiten oder drucken
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-8 text-sm text-gray-600">
        <h2 className="font-semibold mb-2">Interne Test-Logs:</h2>
        <pre className="bg-gray-100 p-3 rounded border border-gray-200 whitespace-pre-wrap">
{log.length > 0 ? log.join('\n') : 'Noch nichts geklickt'}
        </pre>
      </div>
    </div>
  );
}
