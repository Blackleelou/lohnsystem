import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export default function TestModalPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow"
      >
        Öffne Testmodal
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onOpenChange={() => setOpen(false)}
          className="w-[90vw] h-[90vh] max-w-[90vw] p-0 overflow-hidden rounded-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <DialogTitle className="text-2xl font-semibold">Breitentest</DialogTitle>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">✕</button>
          </div>

          {/* Split View: 25% / 75% */}
          <div className="flex h-[calc(90vh-64px)] w-full border border-red-400">
            {/* Linkes Menü */}
            <aside className="w-1/4 min-w-[220px] max-w-[300px] border-r bg-gray-50 p-6 space-y-4">
              <div className="font-semibold text-gray-700">Linkes Menü</div>
              <div className="flex flex-col gap-2 text-sm">
                <button className="text-left text-gray-700 hover:underline">Option A</button>
                <button className="text-left text-gray-700 hover:underline">Option B</button>
                <button className="text-left text-gray-700 hover:underline">Option C</button>
              </div>
            </aside>

            {/* Rechter Inhalt */}
            <main className="w-3/4 p-10 overflow-auto">
              <h2 className="text-lg font-semibold mb-4">Testinhalt rechts</h2>
              <p className="text-gray-700">
                Dies ist nur ein Dummy-Text zum Testen der Breite. Das Modal sollte ca. 90 % des Bildschirms einnehmen und sauber aussehen.
              </p>
            </main>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
