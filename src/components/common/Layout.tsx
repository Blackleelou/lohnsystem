import UserMenu from '@/components/user/UserMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950">
      <header className="backdrop-blur bg-white/60 dark:bg-gray-900/70 sticky top-0 z-50 border-b border-white/30 dark:border-gray-800/80">
        <div className="relative w-full h-[60px] px-4 flex items-center justify-between">
          {/* Platzhalter links */}
          <div className="w-[60px]" />

          {/* Responsive Branding: Logo + Text nebeneinander */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:-top-10 -top-6">
            <object
              type="image/svg+xml"
              data="/logo.svg"
              className="w-[170px] sm:w-[210px] h-auto"
            />
            <span className="text-lg sm:text-2xl font-extrabold text-gray-800 dark:text-white -mt-1 sm:-mt-2 whitespace-nowrap">
              meinLohn
            </span>
          </div>

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
