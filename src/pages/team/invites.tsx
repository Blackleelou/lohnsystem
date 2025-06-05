import TeamLayout from "@/components/team/TeamLayout";
import TeamInviteGenerator from "@/components/team/TeamInviteGenerator";

export default function TeamInvitePage() {
  return (
    <TeamLayout>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Einladungen verwalten</h1>
        <TeamInviteGenerator />
      </div>
    </TeamLayout>
  );
}
