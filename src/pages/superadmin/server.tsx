import SuperadminLayout from "@/components/superadmin/SuperadminLayout";

export default function SuperadminServerPage() {
  return (
    <SuperadminLayout>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Server & DevOps</h1>
        <p className="text-gray-500">Infos zu Deployment, Builds, Serverstatus.</p>
      </div>
    </SuperadminLayout>
  );
}