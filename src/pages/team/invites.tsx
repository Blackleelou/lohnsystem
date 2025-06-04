// src/pages/team/invites.tsx

import TeamLayout from "@/components/team/TeamLayout";
import QRCodeInviteForm from "@/components/team/QRCodeInviteForm";
import LinkInviteForm from "@/components/team/LinkInviteForm";

export default function InvitePage() {
  return (
    <TeamLayout>
      <div className="max-w-3xl mx-auto p-6 space-y-10">
        <section className="border p-4 rounded shadow bg-white">
          <h2 className="text-xl font-bold mb-4 text-center">QR-Code Einladung</h2>
          <QRCodeInviteForm />
        </section>

        <section className="border p-4 rounded shadow bg-white">
          <h2 className="text-xl font-bold mb-4 text-center">Einladungslink (E-Mail / WhatsApp)</h2>
          <LinkInviteForm />
        </section>
      </div>
    </TeamLayout>
  );
}
