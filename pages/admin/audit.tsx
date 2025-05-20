
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AuditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !session.user?.email) {
      router.push("/login");
      return;
    }

    // Optional: Nur bestimmte E-Mail zulassen
    if (session.user.email !== "jantzen.chris@gmail.com") {
      router.push("/dashboard");
      return;
    }

    fetch("/api/admin/audit")
      .then((res) => res.json())
      .then((data) => setLogs(data.logs))
      .catch(() => setLogs([]));
  }, [session, status, router]);

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
          {logs.map((log: any) => (
            <tr key={log.id}>
              <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="p-2 border">{log.action}</td>
              <td className="p-2 border">{log.userId}</td>
              <td className="p-2 border">{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
