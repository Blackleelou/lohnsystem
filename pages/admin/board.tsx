// Datei: pages/admin/board.tsx

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SuperadminLayout from "@/components/SuperadminLayout";

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
    if (!session || session.user?.email !== "jantzen.chris@gmail.com") {
      router.replace("/dashboard");
    }
  }, [session, status]);

  useEffect(() => {
    fetch("/api/admin/board")
      .then((res) => res.json())
      .then((data) => setEntries(data.entries));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Superadmin Board</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white border border-gray-200 p-4 rounded-md shadow-sm hover:shadow transition"
          >
            <h2 className="font-semibold text-lg text-gray-800 mb-2">
              {entry.title}
            </h2>
            <p className="text-sm text-gray-500">Kategorie: {entry.category}</p>
            <p className="text-sm text-gray-500 mb-2">
              Status: <span className="font-medium">{entry.status}</span>
            </p>
            {entry.notes && (
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{entry.notes}</p>
            )}
            <p className="text-xs text-gray-400 mt-4">
              Erstellt: {new Date(entry.createdAt).toLocaleString()}
              {entry.completedAt && (
                <>
                  <br />
                  Fertig: {new Date(entry.completedAt).toLocaleString()}
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
BoardPage.getLayout = (page: React.ReactNode) => (
  <SuperadminLayout>{page}</SuperadminLayout>
);
