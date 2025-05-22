import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const isSuperadmin = session?.user?.email === "jantzen.chris@gmail.com";

  const handleDelete = async () => {
    if (!confirm("Möchtest du dein Konto wirklich löschen?")) return;

    const res = await fetch("/api/user/delete", {
      method: "DELETE",
    });

    if (res.ok) {
      signOut();
    } else {
      const data = await res.json();
      alert("Fehler: " + data.message);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border-none text-2xl cursor-pointer"
        aria-label="Benutzermenü öffnen"
      >
        &#9776;
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 bg-white shadow-lg p-4 z-50 rounded-lg min-w-[180px] space-y-2">
          {isSuperadmin && (
            <>
              <Link href="/superadmin" className="block text-blue-600 hover:underline">
                Superadmin-Menü
              </Link>
              <Link href="/admin/audit" className="block text-blue-600 hover:underline">
                Audit-Log
              </Link>
              <Link href="/admin/board" className="block text-blue-600 hover:underline">
                ToDo-Board
              </Link>
            </>
          )}

          <button
            onClick={handleDelete}
            className="w-full text-left text-gray-700 hover:text-red-600"
          >
            Account löschen
          </button>

          <button
            onClick={() => signOut()}
            className="w-full text-left text-red-500 hover:text-red-700"
          >
            Logout
          </button>

          <LanguageSwitcher />
        </div>
      )}
    </div>
  );
}
