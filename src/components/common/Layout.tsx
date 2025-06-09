import UserMenu from '@/components/user/UserMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950">
      <header className="backdrop-blur bg-white/60 dark:bg-gray-900/70 sticky top-0 z-50 border-b border-white/30 dark:border-gray-800/80">
        <div className="relative w-full h-[60px] px-4 flex items-center justify-between">
          {/* Platzhalter für Symmetrie */}
          <div className="w-[60px]" />

          {/* Menü rechts */}
          <UserMenu />
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
