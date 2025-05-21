import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

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
      >
        &#9776;
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 bg-white shadow-lg p-4 z-50 rounded-lg min-w-[160px]">
          {session?.user?.email === "jantzen.chris@gmail.com" && (
            <>
              <Link
                href="/superadmin"
                className="block mb-2 text-blue-600 hover:underline"
              >
                Superadmin-Menü
              </Link>
              <Link
                href="/admin/audit"
                className="block mb-2 text-blue-600 hover:underline"
              >
                Audit-Log
              </Link>
            </>
          )}
          <button
            onClick={handleDelete}
            className="w-full text-left mb-2 hover:text-red-600"
          >
            Account löschen
          </button>
          <button
            onClick={() => signOut()}
            className="w-full text-left mb-2 text-red-500 hover:text-red-700"
          >
            Logout
          </button>
          <LanguageSwitcher />
        </div>
      )}
    </div>
  );
}
