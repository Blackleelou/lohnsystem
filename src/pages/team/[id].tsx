// src/pages/team/[id].tsx

import { useRouter } from "next/router";
import Layout from "@/components/common/Layout";

export default function TeamDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-8 mt-12 bg-white dark:bg-gray-900 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Team-Detailseite
        </h1>
        <div>
          <b>Team-ID:</b> {id}
        </div>
        <div className="mt-4 text-gray-500">
          Hier können später Einstellungen, Mitglieder usw. angezeigt werden.
        </div>
      </div>
    </Layout>
  );
}
