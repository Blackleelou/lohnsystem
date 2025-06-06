import TeamLayout from "@/components/team/TeamLayout";
import TeamInviteGenerator from "@/components/team/TeamInviteGenerator";

export default function TeamInvitePage() {
  return (
    <TeamLayout>
      <div className="max-w-6xl mx-auto mt-10 px-4">
      
      <TeamInviteGenerator />
      </div>
    </TeamLayout>
  );
}
