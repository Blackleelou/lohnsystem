import SuperadminLayout from '@/components/superadmin/SuperadminLayout';

export default function SuperadminStatisticsPage() {
  return (
    <SuperadminLayout>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Statistiken & Changelog</h1>
        <p className="text-gray-500">Hier werden künftig Statistiken und Changelogs angezeigt.</p>
      </div>
    </SuperadminLayout>
  );
}
