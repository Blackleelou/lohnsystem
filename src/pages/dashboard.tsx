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
      <div className="flex min-h-[60vh] justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <DashboardCard
            icon={<User className="w-12 h-12 text-blue-500 dark:text-blue-300" />}
            title="Solo-Modus"
            text="Starte sofort & nutze alle Funktionen für dich alleine."
            buttonText="Jetzt loslegen"
            color="text-blue-500"
            onClick={() => router.push("/dashboard?mode=solo")}
          />
          <DashboardCard
            icon={<Users className="w-12 h-12 text-violet-500 dark:text-violet-300" />}
            title="Team beitreten/erstellen"
            text="Gründe ein Team für Kollegen, Betriebsrat oder deine Abteilung. Lade andere ein und arbeite gemeinsam!"
            buttonText="Team starten"
            color="text-violet-500"
            onClick={() => router.push("/team/create")}
          />
          <DashboardCard
            icon={<Link2 className="w-12 h-12 text-green-500 dark:text-green-300" />}
            title="Mit Einladungslink beitreten"
            text="Du hast einen Link bekommen? Klicke hier und trete dem Team direkt bei!"
            buttonText="Einladungslink einlösen"
            color="text-green-500"
            onClick={() => router.push("/invite/join")}
          />
        </div>
      </div>
    </Layout>
  );
}
