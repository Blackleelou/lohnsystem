import dynamic from "next/dynamic";

const Superpanel = dynamic(() => import("@/components/superadmin/SuperadminLayout"), { ssr: false });

export default function SuperpanelPage() {
  return <Superpanel />;
}
