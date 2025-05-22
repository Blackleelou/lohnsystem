import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SuperadminLayout from "@/components/SuperadminLayout";

type LogEntry = {
  id: string;
  action: string;
  ip: string;
  timestamp: string;
  userId: string;
};

export default function AuditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !session.user?.email) {
      router.push("/login");
      return;
    }

    if (session.user.email !== "jantzen.chris@gmail.com") {
      router.push("/dashboard");
      return;
    }

    fetch("/api/admin/audit")
      .then((res) => res.json())
      .then((data) => setLogs(data.logs))
      .catch(() => setLogs([]));
  }, [session, status, router]);

  const handleExport = () => {
    const header = "Zeit;Aktion;UserID;IP";
    const rows = logs.map(log =>
      `${new Date(log.timestamp).toISOString()};${log.action};${log.userId};${log.ip}`
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <SuperadminLayout>
      <h1 className="text-2xl font-bold mb-6">Audit-Log</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Zeitpunkt</th>
              <th className="p-3 border">Aktion</th>
              <th className="p-3 border">User-ID</th>
              <th className="p-3 border">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="p-3 border">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-3 border">{log.action}</td>
                <td className="p-3 border">{log.userId}</td>
                <td className="p-3 border">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleExport}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        CSV exportieren
      </button>
    </SuperadminLayout>
  );
}
