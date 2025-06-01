import dynamic from "next/dynamic";

const Superpanel = dynamic(() => import("@/components/Superpanel"), { ssr: false });

export default function SuperpanelPage() {
  return <Superpanel />;
}
