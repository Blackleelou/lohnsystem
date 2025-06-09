import SuperadminLayout from '@/components/superadmin/SuperadminLayout';
import UserStats from '@/components/superadmin/statistics/UserStats';
import CompanyStats from '@/components/superadmin/statistics/CompanyStats';
import ShiftStats from '@/components/superadmin/statistics/ShiftStats';
import ShiftDistribution from '@/components/superadmin/statistics/ShiftDistribution';
import LohnStats from '@/components/superadmin/statistics/LohnStats';
import ActivityStats from '@/components/superadmin/statistics/ActivityStats';
import AuditStats from '@/components/superadmin/statistics/AuditStats';
import PerformanceStats from '@/components/superadmin/statistics/PerformanceStats';
import GrowthStats from '@/components/superadmin/statistics/GrowthStats';
import ExportStats from '@/components/superadmin/statistics/ExportStats';

export default function SuperadminStatisticsPage() {
  const sections = [
    { title: "Benutzer & Firmen", components: [<UserStats />, <CompanyStats />, <GrowthStats />] },
    { title: "Schichten", components: [<ShiftStats />, <ShiftDistribution />] },
    { title: "Löhne", components: [<LohnStats />] },
    { title: "System & Nutzung", components: [<ActivityStats />, <AuditStats />, <PerformanceStats />, <ExportStats />] },
  ];

  return (
    <SuperadminLayout>
      <h1 className="text-2xl font-bold mb-6 text-center">Statistiken & Changelog</h1>
      <div className="space-y-8">
        {sections.map(({ title, components }) => (
          <div key={title}>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {components.map((Component, idx) => (
                <div key={idx}>{Component}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SuperadminLayout>
  );
}
