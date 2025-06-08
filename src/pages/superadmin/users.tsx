import SuperadminLayout from '@/components/superadmin/SuperadminLayout';

export default function SuperadminUsersPage() {
  return (
    <SuperadminLayout>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">User-Monitoring & Security</h1>
        <p className="text-gray-500">Sessions, Rollen und Sicherheit werden hier dargestellt.</p>
      </div>
    </SuperadminLayout>
  );
}
