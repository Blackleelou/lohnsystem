import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export default function ModalLayoutTest() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-10">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Öffne Testmodal
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onOpenChange={() => setOpen(false)}
          className="!w-[95vw] !h-[90vh] !max-w-none !max-h-none !p-0 !overflow-hidden !rounded-xl !bg-white border-4 border-red-400"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <DialogTitle className="text-2xl font-semibold">Breitentest</DialogTitle>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {/* Split Layout */}
          <div className="flex h-[calc(90vh-64px)] w-full">
            {/* Sidebar */}
            <aside className="w-1/4 max-w-[300px] min-w-[220px] border-r bg-gray-50 p-6">
              <div className="text-sm font-semibold mb-2">Linkes Menü</div>
              <ul className="text-sm space-y-2">
                <li className="hover:underline cursor-pointer">Option A</li>
                <li className="hover:underline cursor-pointer">Option B</li>
                <li className="hover:underline cursor-pointer">Option C</li>
              </ul>
            </aside>

            {/* Main Content */}
            <main className="w-3/4 p-10 overflow-auto">
              <h2 className="text-lg font-semibold mb-4">Testinhalt rechts</h2>
              <p className="text-gray-600">
                Dies ist nur ein Dummy-Text zum Testen der Breite. Das Modal sollte ca. 95 % des Bildschirms einnehmen
                und sauber aufgeteilt sein: 25 % links, 75 % rechts.
              </p>
            </main>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
