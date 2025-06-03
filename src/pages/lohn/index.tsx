import Layout from "@/components/common/Layout";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.companyId) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return { props: {} };
}

export default function LohnUebersicht() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200">
          Mein Lohn & Auswertung
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Hier siehst du bald alle Schichten, Lohnabrechnungen und Auswertungen auf einen Blick.
        </p>
        <div className="mt-8 text-gray-400">[Demo-Ansicht – Inhalte folgen!]</div>
      </div>
    </Layout>
  );
}
