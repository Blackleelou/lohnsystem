import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Layout from "@/components/common/Layout";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Info für Komponente: Team-Modus + Teamname holen (Demo: Platzhalter)
  let teamMode = false;
  let teamName = "";
  if (session?.user?.companyId) {
    teamMode = true;
    // Später: echten Teamnamen aus DB holen, hier nur Demo:
    teamName = "Mein Team"; // Oder aus DB
  }

  return {
    props: {
      teamMode,
      teamName,
    },
  };
};

export default function LohnUebersicht({ teamMode, teamName }: { teamMode: boolean; teamName: string }) {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200">
          Mein Lohn & Auswertung
        </h1>
        {/* Nur wenn Team-Modus */}
        {teamMode && (
          <div className="mb-8 p-3 bg-blue-50 dark:bg-blue-900/40 rounded text-blue-900 dark:text-blue-100 text-sm">
            <span className="font-semibold">Team-Modus aktiv:</span>{" "}
            <span>{teamName ? teamName : "Dein Team"}</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
              Du nutzt die zentralen Einstellungen deines Teams. Alle Lohnregeln und Auswertungen werden automatisch übernommen!
            </span>
          </div>
        )}
        {/* Kein Team = solo */}
        {!teamMode && (
          <div className="mb-8 p-3 bg-gray-50 dark:bg-gray-800/40 rounded text-gray-800 dark:text-gray-300 text-sm">
            <span className="font-semibold">Solo-Modus:</span>{" "}
            Du nutzt eigene Einstellungen. Falls du später ein Team erstellst oder beitrittst, werden die Team-Regeln automatisch angewendet.
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-400">
          Hier siehst du bald alle Schichten, Lohnabrechnungen und Auswertungen auf einen Blick.
        </p>
        <div className="mt-8 text-gray-400">[Demo-Ansicht – Inhalte folgen!]</div>
      </div>
    </Layout>
  );
}
