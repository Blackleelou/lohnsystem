
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Audit-Log</h1>
      <table className="w-full border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">Zeitpunkt</th>
            <th className="p-2 border">Aktion</th>
            <th className="p-2 border">User-ID</th>
            <th className="p-2 border">IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="p-2 border">{log.action}</td>
              <td className="p-2 border">{log.userId}</td>
              <td className="p-2 border">{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleExport}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        CSV exportieren
      </button>
    </div>
  );
}
