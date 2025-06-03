import { GetServerSideProps } from "next";
import { requireAuth } from "@/lib/authRequired";
import Layout from "@/components/common/Layout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Users, User, Link2 } from "lucide-react";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = requireAuth;

export default function Dashboard() {
  const router = useRouter();

  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto mt-8">
        {/* Headline und Intro */}
        <div className="text-center mb-8 px-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-2">
            Willkommen im Team- & Solo-Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
            <span className="font-semibold text-violet-700 dark:text-violet-300">Extra entwickelt für Betriebsräte, Teamleiter & engagierte Kolleginnen und Kollegen.</span>
            <br />
            Unterstütze dein Team, behalte alle Schichten & Rechte im Blick und arbeite gemeinsam an einem besseren Arbeitsplatz.
          </p>
        </div>
        {/* Kacheln */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2">
          <DashboardCard
            icon={<User className="w-10 h-10 text-blue-500 dark:text-blue-300" />}
            title="Solo-Modus"
            text="Starte sofort & nutze alle Funktionen für dich alleine – keine Freigabe, kein Stress."
            buttonText="Jetzt loslegen"
            color="text-blue-500"
            onClick={() => router.push("/dashboard?mode=solo")}
          />
          <DashboardCard
            icon={<Users className="w-10 h-10 text-violet-500 dark:text-violet-300" />}
            title="Team-Start"
            text="Gründe ein Team für Kollegen, Betriebsrat oder Abteilung. Lade ein, verwalte gemeinsam!"
            buttonText="Team starten"
            color="text-violet-500"
            onClick={() => router.push("/team/create")}
          />
          <DashboardCard
            icon={<Link2 className="w-10 h-10 text-green-500 dark:text-green-300" />}
            title="Mit Einladungslink beitreten"
            text="Du hast einen Link bekommen? Klicke hier & werde Teil deines Teams."
            buttonText="Einladungslink einlösen"
            color="text-green-500"
            onClick={() => router.push("/invite/join")}
          />
        </div>
      </div>
    </Layout>
  );
}
