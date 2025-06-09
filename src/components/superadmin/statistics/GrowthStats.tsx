import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

type GrowthData = { label: string; count: number }[];

export default function GrowthStats() {
  const [users, setUsers] = useState<GrowthData>([]);
  const [companies, setCompanies] = useState<GrowthData>([]);

  useEffect(() => {
    fetch("/api/admin/statistics/growth")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setCompanies(data.companies);
      });
  }, []);

  const chartData = users.map((u, i) => ({
    label: u.label,
    users: u.count,
    companies: companies[i]?.count || 0,
  }));

  return (
    <div className="p-4 shadow rounded bg-white mt-6">
      <h3 className="text-lg font-semibold mb-2">Wachstum (letzte 6 Wochen)</h3>
      <p className="text-sm text-gray-500 mb-4">Neue Nutzer und Firmen pro Woche</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="users" fill="#2563eb" name="Nutzer" />
          <Bar dataKey="companies" fill="#10b981" name="Firmen" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
