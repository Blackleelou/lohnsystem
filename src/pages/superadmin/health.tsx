import { useEffect, useState } from "react";
import SuperadminLayout from "@/components/superadmin/SuperadminLayout";

type HealthStatus = {
  db: "ok" | "warn" | "error";
  mail: "ok" | "warn" | "error";
  api: "ok" | "warn" | "error";
  build: "ok" | "warn" | "error";
  serverTime?: string;
};

function StatusAmpel({ status }: { status: "ok" | "warn" | "error" }) {
  const color =
    status === "ok"
      ? "bg-green-500"
      : status === "warn"
      ? "bg-yellow-400"
      : "bg-red-500";
  return (
    <span className={`inline-block w-4 h-4 rounded-full mr-2 ${color}`}></span>
  );
}

const LABELS: Record<keyof Omit<HealthStatus, "serverTime">, string> = {
  db: "Datenbank",
  mail: "Mail-Service",
  api: "API",
  build: "Build",
};

export default function SystemStatusPage() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/health")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <SuperadminLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">
          System-Status & Health
        </h1>
        {loading ? (
          <div>Lade Status…</div>
        ) : status ? (
          <div className="space-y-4">
            {Object.entries(LABELS).map(([key, label]) => {
  // Value ist "ok" | "warn" | "error" | undefined
  const value = status?.[key as keyof HealthStatus] as "ok" | "warn" | "error" | undefined;
  const safeValue = value ?? "error"; // Fallback auf error, falls fehlt
  return (
    <div key={key} className="flex items-center bg-white rounded shadow p-4">
      <StatusAmpel status={safeValue} />
      <span className="font-semibold mr-2">{label}:</span>
      <span>
        {safeValue === "ok"
          ? "OK"
          : safeValue === "warn"
          ? "Warnung"
          : "Fehler"}
      </span>
    </div>
  );
})}
            {status.serverTime && (
              <div className="text-xs text-gray-400 mt-4">
                Serverzeit: {new Date(status.serverTime).toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="text-red-500">Fehler beim Laden des Status.</div>
        )}
      </div>
    </SuperadminLayout>
  );
}
