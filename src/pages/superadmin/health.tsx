import SuperadminLayout from "@/components/superadmin/SuperadminLayout";

export default function SuperadminHealthPage() {
  return (
    <SuperadminLayout>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">System-Status & Health-Checks</h1>
        <p className="text-gray-500">Hier siehst du später alle Checks zu Server, DB, Mail etc.</p>
      </div>
    </SuperadminLayout>
  );
}