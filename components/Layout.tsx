import UserMenu from "./UserMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow px-6 py-3 flex justify-end sticky top-0 z-40">
        <UserMenu />
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
