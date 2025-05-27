// Datei: pages/dashboard.tsx

import { GetServerSideProps } from "next";
import { requireAuth } from "@/lib/authRequired"; // zentrale Auth-Prüfung
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ModeSelection from "@/components/onboarding/ModeSelection";
import Layout from "@/components/Layout";
import { Loader2 } from "lucide-react";

export const getServerSideProps: GetServerSideProps = requireAuth;

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Sobald die Session geladen ist und der User einen Modus gewählt hat, redirect!
    if (status === "authenticated" && session?.user?.mode) {
      if (session.user.mode === "solo") {
        router.replace("/solo-mode");
      } else if (session.user.mode === "company") {
        router.replace("/company-mode");
      }
    }
  }, [session, status, router]);

  return (
    <Layout>
      <div className="flex min-h-[60vh] justify-center items-center">
        {/* Ladeindikator */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-blue-700 font-semibold">Session wird geladen...</span>
          </div>
        )}

        {/* Onboarding, wenn kein Modus gewählt */}
        {status === "authenticated" && !session?.user?.mode && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-lg w-full border border-gray-100 dark:border-gray-800">
            <h1 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-200">
              Willkommen! Wähle deinen Modus
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
              Bitte wähle, ob du das System alleine nutzt oder als Firmenverwaltung starten möchtest.
            </p>
            <ModeSelection />
          </div>
        )}
      </div>
    </Layout>
  );
}
