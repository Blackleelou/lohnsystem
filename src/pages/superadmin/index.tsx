import dynamic from "next/dynamic"; // DAS FEHLT!

const SuperadminLayout = dynamic(
  () => import("@/components/superadmin/SuperadminLayout"),
  { ssr: false }
);

export default function SuperpanelPage() {
  return (
    <SuperadminLayout>
      <div className="text-center p-6">
        Willkommen im Superadmin-Bereich!
      </div>
    </SuperadminLayout>
  );
}
