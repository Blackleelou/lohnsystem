// src/pages/team/settings.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/common/Layout";
import { useSession } from "next-auth/react";

export default function TeamSettings() {
  const { data: session, status } = useSession();
  const [team, setTeam] = useState<{ name: string; description?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Teamdaten laden
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.companyId) {
      router.replace("/dashboard");
      return;
    }
    setLoading(true);
    fetch("/api/team/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.team?.name) router.replace("/dashboard");
        else setTeam(data.team);
      })
      .catch(() => setTeam(null))
      .finally(() => setLoading(false));
  }, [session, status, router]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-16 text-center text-gray-500">Lade Teamdaten…</div>
      </Layout>
    );
  }

  if (!team) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-16 text-center text-gray-500">
          Kein Team gefunden.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-12">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Team-Einstellungen</h1>
        <div className="mb-6">
          <div className="font-semibold text-lg">{team.name}</div>
          {team.description && <div className="text-gray-500">{team.description}</div>}
        </div>
        {/* Hier kommen später weitere Einstellungsmöglichkeiten hin */}
      </div>
    </Layout>
  );
}
