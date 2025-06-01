import { GetServerSideProps } from "next";
import { requireAuth } from "@/lib/authRequired";
import Layout from "@/components/Layout";

export const getServerSideProps: GetServerSideProps = requireAuth;

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex min-h-[60vh] justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {/* SOLO */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-100 dark:border-gray-800 cursor-pointer transition hover:shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-200">Solo</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Nutze das System komplett alleine.
            </p>
          </div>
          {/* TEAM */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-100 dark:border-gray-800 cursor-pointer transition hover:shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-200">Team</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Starte als Team/Firma mit mehreren Nutzern.
            </p>
          </div>
          {/* EINLADUNG */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-100 dark:border-gray-800 cursor-pointer transition hover:shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-200">Einladungslink erhalten</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Wurde dir ein Einladungslink geschickt? Hier kannst du beitreten.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
