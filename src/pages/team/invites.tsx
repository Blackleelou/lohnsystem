import TeamLayout from "@/components/team/TeamLayout";
import InviteQrSection from "@/components/team/InviteQrSection";
import InviteLinkSection from "@/components/team/InviteLinkSection";

export default function InvitePage() {
  return (
    <TeamLayout>
      <h1 className="text-2xl font-bold mb-6 text-center">Einladungen verwalten</h1>
      <div className="grid gap-12 max-w-3xl mx-auto">
        <InviteQrSection />
        <InviteLinkSection />
      </div>
    </TeamLayout>
  );
}
