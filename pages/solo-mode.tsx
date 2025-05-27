// Datei: pages/solo-mode.tsx

import { GetServerSideProps } from "next";
import { requireAuth } from "@/lib/authRequired";
import Layout from "@/components/Layout";

export const getServerSideProps: GetServerSideProps = requireAuth;

export default function SoloModePage() {
  return (
    <Layout>
      <div className="max-w-xl mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Einzelmodus aktiv</h1>
        <p>
          Du befindest dich jetzt im Einzelmodus. Alle deine Daten sind nur für dich sichtbar.
        </p>
      </div>
    </Layout>
  );
}
