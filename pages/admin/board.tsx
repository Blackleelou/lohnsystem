// Datei: pages/admin/board.tsx

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type Entry = {
  id: number;
  title: string;
  status: string;
  category: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
};

export default function BoardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.email !== "jantzen.chris@gmail.com") {
      router.push("/dashboard");
    }
  }, [session, status]);

  useEffect(() => {
    fetch("/api/admin/board")
      .then((res) => res.json())
      .then((data) => setEntries(data.entries));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Superadmin Board</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white border p-4 rounded shadow">
            <h2 className="font-semibold text-lg mb-2">{entry.title}</h2>
            <p className="text-sm text-gray-600 mb-1">
              Kategorie: {entry.category}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Status: <span className="font-medium">{entry.status}</span>
            </p>
            {entry.notes && (
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                {entry.notes}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-4">
              Erstellt am: {new Date(entry.createdAt).toLocaleString()}
              {entry.completedAt && (
                <>
                  <br />
                  Fertig am: {new Date(entry.completedAt).toLocaleString()}
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// SuperadminLayout zuweisen
import SuperadminLayout from "@/components/SuperadminLayout";

BoardPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
