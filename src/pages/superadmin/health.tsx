// src/pages/superadmin/health.tsx
import SuperadminLayout from "@/components/superadmin/SuperadminLayout";

const DUMMY_STATUS = [
  { label: "Datenbank", status: "ok", message: "Verbindung steht" },
  { label: "Mail-Service", status: "warn", message: "Keine Verbindung" },
  { label: "API", status: "ok", message: "API erreichbar" },
  { label: "Build", status: "ok", message: "Letztes Deployment 2025-06-02" },
];

function StatusAmpel({ status }: { status: "ok" | "warn" | "error" }) {
  const color =
    status === "ok" ? "bg-green-500" :
    status === "warn" ? "bg-yellow-400" :
    "bg-red-500";
  return <span className={`inline-block w-4 h-4 rounded-full mr-2 ${color}`}></span>;
}

export default function SystemStatusPage() {
  return (
    <SuperadminLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">System-Status & Health</h1>
        <div className="space-y-4">
          {DUMMY_STATUS.map((item) => (
            <div key={item.label} className="flex items-center bg-white rounded shadow p-4">
              <StatusAmpel status={item.status as any} />
              <span className="font-semibold mr-2">{item.label}:</span>
              <span>{item.message}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 text-xs text-gray-400">Demo: Später kommen hier Live-Checks & weitere Details!</div>
      </div>
    </SuperadminLayout>
  );
}
