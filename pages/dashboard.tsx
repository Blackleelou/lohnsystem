// Datei: pages/dashboard.tsx

import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <p className="text-gray-700 mb-4">
          Hier kommt deine Lohnübersicht hin.
        </p>

        {session?.user?.email?.includes("@gmail.com") && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md border border-yellow-300 mb-4 text-sm">
            Hinweis: Du bist mit deinem <strong>Google-Konto</strong> angemeldet.
            Ein separates Passwort ist nicht erforderlich.
          </div>
        )}
      </div>
    </Layout>
  );
}
