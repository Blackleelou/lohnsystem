import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import Layout from "@/components/common/Layout";
import { useSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Falls kein Team/Firma zugeordnet ist: auf Dashboard zurück
  if (!session?.user?.companyId) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  // Optional: Team-Name oder Description laden (z.B. via Prisma)
  // Übergib sie ggf. als props, falls du sie auf der Seite anzeigen willst!

  return { props: {} };
};

export default function LohnUebersicht() {
  const { data: session } = useSession();

  // Team-Infos aus der Session
  const isTeam = !!session?.user?.companyId;
  // Du kannst später hier auch Teamname/Description ausgeben (siehe Hinweis oben)

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200">
          Mein Lohn & Auswertung
        </h1>
        {isTeam && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded text-sm text-blue-900 dark:text-blue-200">
            <strong>Team-Modus aktiv:</strong> Du bist aktuell Teil eines Teams!
            {/* Hier später: Teamname oder Description ausgeben */}
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
