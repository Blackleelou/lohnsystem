import SuperadminLayout from "@/components/superadmin/SuperadminLayout";

export default function SuperadminErrorsPage() {
  return (
    <SuperadminLayout>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Fehler-Logs & Diagnose</h1>
        <p className="text-gray-500">Fehler-Logs, Filter & Export kommen hier hin.</p>
      </div>
    </SuperadminLayout>
  );
}