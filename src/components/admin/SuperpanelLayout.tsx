// KEIN SuperpanelLayout IN SuperpanelLayout aufrufen!
export default function SuperpanelLayout({ children }: { children: React.ReactNode }) {
  // ... Dein Layout-Code ...
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ... Header, Menü, Main ... */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
