import UserMenu from "./UserMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Feste obere Leiste mit Benutzer-Menü */}
      <header className="bg-white shadow px-6 py-3 flex justify-end items-center sticky top-0 z-50">
        <UserMenu />
      </header>

      {/* Hauptinhalt */}
      <main className="flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
