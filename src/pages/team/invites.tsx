import TeamLayout from "@/components/team/TeamLayout";
import TeamInviteGenerator from "@/components/team/TeamInviteGenerator";

export default function TeamInvitePage() {
  return (
    <TeamLayout>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        {/* Nur eine einzige Überschrift */}
        <h1 className="text-2xl font-bold mb-6">Teameinladungen verwalten</h1>

        {/* Hier wird unsere Komponente eingefügt */}
        <TeamInviteGenerator />
      </div>
    </TeamLayout>
  );
}
