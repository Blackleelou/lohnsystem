import dynamic from "next/dynamic";

const SuperadminLayout = dynamic(() => import("@/components/superadmin/SuperadminLayout"), { ssr: false });

export default function SuperadminHomePage() {
  return (
    <SuperadminLayout>
      <div>
        Willkommen im Superadmin-Bereich!
      </div>
    </SuperadminLayout>
  );
}
