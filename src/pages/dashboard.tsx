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
        {/* Persönlicher Claim & Intro */}
        <div className="text-center mb-8 px-4">
          <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-3">
            Willkommen bei <span className="text-violet-700 dark:text-violet-300">meinLohn</span>!
          </h1>
          <p className="text-gray-800 dark:text-gray-200 text-base md:text-lg leading-relaxed">
            <span className="block font-semibold text-violet-700 dark:text-violet-200 mb-2">
              Dein digitales Team-Tool für mehr Transparenz, Fairness und Entlastung im Job.
            </span>
            <span className="block mb-2">
              Ob im Betriebsrat, als Teamleiter oder einfach als engagierte Kollegin oder Kollege – mit <span className="text-blue-700 font-bold">meinLohn</span> habt ihr die Löhne im Griff und sorgt gemeinsam dafür, dass alles stimmt!
            </span>
            <span className="block">
              Weniger Stress. Mehr Klarheit. Für dich & dein Team.
            </span>
          </p>
        </div>
        {/* Kacheln: Team zuerst */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2">
          <DashboardCard
            icon={<Users className="w-10 h-10 text-violet-500 dark:text-violet-300" />}
            title="Starte mit deinem Team"
            text={
              <>
                Lade deine Kolleg:innen ein, gib die wichtigsten Einstellungen für alle zentral vor <span className="hidden sm:inline">–</span>
                <span className="sm:hidden"><br /></span>
                und sorgt gemeinsam für faire Abrechnung!
              </>
            }
            buttonText="Team erstellen"
            color="text-violet-500"
            onClick={() => router.push("/team/create")}
          />
          <DashboardCard
            icon={<Link2 className="w-10 h-10 text-green-500 dark:text-green-300" />}
            title="Mit Einladungslink beitreten"
            text={
              <>
                Wurdest du eingeladen? Einfach Link eingeben oder scannen <span className="hidden sm:inline">–</span>
                <span className="sm:hidden"><br /></span>
                und sofort mitmachen!
              </>
            }
            buttonText="Beitreten"
            color="text-green-500"
            onClick={() => router.push("/invite/join")}
          />
          <DashboardCard
            icon={<User className="w-10 h-10 text-blue-500 dark:text-blue-300" />}
            title="Allein loslegen"
            text={
              <>
                Nutze <span className="font-semibold">meinLohn</span> ganz privat –
                erfasse und prüfe einfach deine eigenen Schichten und Lohnabrechnungen.
              </>
            }
            buttonText="Solo starten"
            color="text-blue-500"
            onClick={() => router.push("/dashboard?mode=solo")}
          />
        </div>
      </div>
    </Layout>
  );
}
