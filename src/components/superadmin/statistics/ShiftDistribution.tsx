// /src/components/superadmin/statistics/ShiftDistribution.tsx

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { exportCsv } from "@/utils/exportCsv";

export default function ShiftDistribution() {
  const [data, setData] = useState<{ label: string; count: number }[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/admin/statistics/distribution")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        const sum = json.reduce((acc: number, item: { count: number }) => acc + item.count, 0);
        setTotal(sum);
      });
  }, []);

  const chartData = data.map((item) => ({
    ...item,
    percent: ((item.count / total) * 100).toFixed(1),
  }));

  return (
    <div className="p-4 shadow rounded bg-white">
      <h3 className="text-lg font-semibold mb-2">Schichtverteilung</h3>
      <p className="text-sm text-gray-500 mb-4">Zeigt, wie viele Nutzer in welchem Zeitfenster regelmäßig arbeiten</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" width={120} />
          <Tooltip formatter={(value: any, name: string) => [`${value} %`, "Anteil"]} />
          <Bar dataKey="percent" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-sm text-right text-gray-400 mt-2">Gesamt: {total} Schichten</div>
      <button
        onClick={() => exportCsv(chartData, "Schichtverteilung.csv")}
        className="mt-4 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
      >
        CSV exportieren
      </button>
    </div>
  );
}
