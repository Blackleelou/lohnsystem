import UserMenu from "./UserMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950">
      
      {/* Fester Header oben mit vollem Randabstand */}
      <header className="backdrop-blur bg-white/60 dark:bg-gray-900/70 sticky top-0 z-50 border-b border-white/30 dark:border-gray-800/80">
        <div className="w-full px-4 py-3 flex justify-end">
          <UserMenu />
        </div>
      </header>

      {/* Hauptinhalt mit zentrierter max-Breite */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
