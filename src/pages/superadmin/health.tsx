import { useEffect, useState } from "react";
import SuperadminLayout from "@/components/superadmin/SuperadminLayout";
import { CheckCircle, AlertTriangle, XCircle, Database, Mail, Cloud, Cpu } from "lucide-react";

type HealthStatus = {
  db: "ok" | "warn" | "error";
  mail: "ok" | "warn" | "error";
  api: "ok" | "warn" | "error";
  build: "ok" | "warn" | "error";
  serverTime?: string;
};

const ICONS: Record<string, any> = {
  db: Database,
  mail: Mail,
  api: Cloud,
  build: Cpu,
};

const LABELS: Record<keyof Omit<HealthStatus, "serverTime">, string> = {
  db: "Datenbank",
  mail: "Mail-Service",
  api: "API",
  build: "Build",
};

function StatusSymbol({ status }: { status: "ok" | "warn" | "error" }) {
  if (status === "ok")
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  if (status === "warn")
    return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
  return <XCircle className="w-5 h-5 text-red-500" />;
}

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
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-extrabold mb-6 text-blue-700 text-center">
          System-Status & Health
        </h1>
        {loading ? (
          <div className="flex justify-center items-center py-12 text-blue-700 font-medium">Lade Status…</div>
        ) : status ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(LABELS).map(([key, label]) => {
              const value = status?.[key as keyof HealthStatus] as "ok" | "warn" | "error" | undefined;
              const safeValue = value ?? "error";
              const Icon = ICONS[key];
              return (
                <div
                  key={key}
                  className={`flex items-center gap-3 bg-white rounded-2xl shadow-md p-4 border
                    ${
                      safeValue === "ok"
                        ? "border-green-100"
                        : safeValue === "warn"
                        ? "border-yellow-100"
                        : "border-red-200"
                    }
                  `}
                >
                  <span className="bg-blue-50 rounded-full p-2 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </span>
                  <span className="flex-1 font-semibold">{label}</span>
                  <StatusSymbol status={safeValue} />
                  <span
                    className={
                      safeValue === "ok"
                        ? "text-green-600 font-medium"
                        : safeValue === "warn"
                        ? "text-yellow-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {safeValue === "ok"
                      ? "OK"
                      : safeValue === "warn"
                      ? "Warnung"
                      : "Fehler"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-red-500 text-center py-8">Fehler beim Laden des Status.</div>
        )}

        {status?.serverTime && (
          <div className="text-xs text-gray-400 mt-8 text-center">
            Serverzeit: {new Date(status.serverTime).toLocaleString()}
          </div>
        )}
      </div>
    </SuperadminLayout>
  );
}
