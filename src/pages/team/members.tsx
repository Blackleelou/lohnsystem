import Layout from "@/components/common/Layout";
import TeamSidebar from "@/components/team/TeamLayout";
export default function TeamMembersPage() {
  return (
    <Layout>
      <div className="flex max-w-4xl mx-auto py-12">
        <TeamSidebar />
        <main className="flex-1 pl-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-2">Mitglieder</h1>
          <div className="text-gray-500">Hier kommt die Mitgliederverwaltung hin.</div>
        </main>
      </div>
    </Layout>
  );
}
