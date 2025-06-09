// /src/components/superadmin/statistics/ActivityStats.tsx

import { useEffect, useState } from "react";
import { Activity, Clock, AlertTriangle } from "lucide-react";

export default function ActivityStats() {
  const [stats, setStats] = useState<{ today: number; week: number; inactive: number } | null>(null);

  useEffect(() => {
    fetch("/api/admin/statistics/activity")
      .then(res => res.json())
      .then(setStats);
  }, []);

  return (
    <div className="p-4 shadow rounded bg-white">
      <h3 className="text-lg font-semibold mb-4">Nutzeraktivität</h3>
      {!stats ? (
        <p className="text-sm text-gray-500">Lade Daten...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<Activity className="text-green-600" />} label="Heute aktiv" value={stats.today} />
          <StatCard icon={<Clock className="text-blue-600" />} label="Aktiv letzte 7 Tage" value={stats.week} />
          <StatCard icon={<AlertTriangle className="text-red-600" />} label=">30 Tage inaktiv" value={stats.inactive} />
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: JSX.Element; label: string; value: number }) {
  return (
    <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded">
      <div className="p-2 bg-white rounded shadow-sm">
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}
