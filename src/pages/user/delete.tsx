import { useState } from "react";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import UserSettingsLayout from "@/components/user/UserSettingsLayout";

export default function DeletePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Willst du deinen Account wirklich löschen? Das kann nicht rückgängig gemacht werden!"
    );
    if (!confirmDelete) return;

    setLoading(true);
    // Hier würde der API-Call zum Löschen stehen
    // await fetch("/api/user/delete", { method: "DELETE" });
    setLoading(false);
    // Nach dem Löschen zurück zum Dashboard
    router.replace("/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-2">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Account löschen</h1>
      <p className="text-sm text-red-600 mb-4">
        Diese Aktion kann nicht rückgängig gemacht werden.
      </p>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition disabled:opacity-50"
      >
        {loading ? "Lösche..." : "Account löschen"}
      </button>
    </div>
  );
}

DeletePage.getLayout = function getLayout(page: ReactElement) {
  return <UserSettingsLayout>{page}</UserSettingsLayout>;
};
