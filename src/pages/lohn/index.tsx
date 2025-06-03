import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/common/Layout";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  let teamMode = false;
  let teamName = "";
  let teamDescription = "";

  if (session?.user?.companyId) {
    teamMode = true;
    // Hole echten Teamnamen & Beschreibung
    const company = await prisma.company.findUnique({
      where: { id: session.user.companyId },
      select: { name: true, description: true },
    });
    if (company) {
      teamName = company.name;
      teamDescription = company.description || "";
    }
  }

  return {
    props: {
      teamMode,
      teamName,
      teamDescription,
    },
  };
};

export default function LohnUebersicht({
  teamMode,
  teamName,
  teamDescription,
}: {
  teamMode: boolean;
  teamName: string;
  teamDescription?: string;
}) {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200">
          Mein Lohn & Auswertung
        </h1>
        {teamMode && (
          <div className="mb-8 p-3 bg-blue-50 dark:bg-blue-900/40 rounded text-blue-900 dark:text-blue-100 text-sm">
            <span className="font-semibold">Team-Modus aktiv:</span>{" "}
            <span>{teamName}</span>
            {teamDescription && (
              <span className="block mt-1 text-xs text-gray-600 dark:text-gray-300">
                {teamDescription}
              </span>
            )}
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
              Du nutzt die zentralen Einstellungen deines Teams. Alle Lohnregeln und Auswertungen werden automatisch übernommen!
            </span>
          </div>
        )}
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
