import SuperadminLayout from '@/components/superadmin/SuperadminLayout';

export default function SuperadminMaintenancePage() {
  return (
    <SuperadminLayout>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Maintenance & Tools</h1>
        <p className="text-gray-500">
          Tools wie Cache leeren, Jobs neu starten, etc. werden hier bereitgestellt.
        </p>
      </div>
    </SuperadminLayout>
  );
}
