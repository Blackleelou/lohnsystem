import { useEffect, useState } from 'react';
import SuperadminLayout from '@/components/superadmin/SuperadminLayout';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Database,
  Mail,
  Cloud,
  Cpu,
  BarChart2,
  RefreshCcw,
  Megaphone,
} from 'lucide-react';

type HealthStatus = {
  db: {
    status: 'ok' | 'warn' | 'error';
    sizePretty?: string;
    sizeBytes?: number;
    sizePercent?: number;
    topTables?: { name: string; sizeBytes: number }[];
  };
  mail: {
    status: 'ok' | 'warn' | 'error';
    error?: string;
  };
  api: 'ok' | 'warn' | 'error';
  build: 'ok' | 'warn' | 'error';
  serverTime?: string;
  warnings?: string[];
};

const ICONS: Record<string, any> = {
  db: Database,
  mail: Mail,
  api: Cloud,
  build: Cpu,
};

const LABELS: Record<keyof Omit<HealthStatus, 'serverTime' | 'warnings'>, string> = {
  db: 'Datenbank',
  mail: 'Mail-Service',
  api: 'API',
  build: 'Build',
};

function StatusSymbol({ status }: { status: 'ok' | 'warn' | 'error' }) {
  if (status === 'ok') return <CheckCircle className="w-5 h-5 text-green-500" />;
  if (status === 'warn') return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
  return <XCircle className="w-5 h-5 text-red-500" />;
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span className="group relative cursor-pointer text-gray-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
      <span className="absolute z-50 hidden group-hover:block bg-white border rounded px-3 py-2 text-xs text-gray-700 shadow-lg w-64 top-6 left-1/2 -translate-x-1/2">
        {children}
      </span>
    </span>
  );
}

export default function SystemStatusPage() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [gaStatus, setGaStatus] = useState<'ok' | 'warn' | 'error'>('warn');
  const [marketingStatus, setMarketingStatus] = useState<'ok' | 'warn' | 'error'>('warn');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/health')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    try {
      const consent = JSON.parse(localStorage.getItem('cookie-consent') || '{}');
      setGaStatus(consent.statistik === true ? 'ok' : 'warn');
      setMarketingStatus(consent.marketing === true ? 'ok' : 'warn');
    } catch {
      setGaStatus('error');
      setMarketingStatus('error');
    }
  }, []);

  const resetConsent = () => {
    localStorage.removeItem('cookie-consent');
    location.reload();
  };

  return (
    <SuperadminLayout>
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-extrabold mb-6 text-blue-700 text-center">
          System-Status & Health
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12 text-blue-700 font-medium">
            Lade Status…
          </div>
        ) : status ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(LABELS).map(([key, label]) => {
              const isDb = key === 'db';
              const value = isDb
                ? status.db.status
                : status?.[key as keyof HealthStatus] as 'ok' | 'warn' | 'error' | undefined;
              const Icon = ICONS[key];
              const safeValue = value ?? 'error';

              return (
                <div
                  key={key}
                  className={`flex flex-col items-start gap-1 bg-white rounded-2xl shadow-md p-4 border ${
                    safeValue === 'ok'
                      ? 'border-green-100'
                      : safeValue === 'warn'
                      ? 'border-yellow-100'
                      : 'border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="bg-blue-50 rounded-full p-2 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </span>
                    <span className="flex-1 font-semibold">{label}</span>
                    <StatusSymbol status={safeValue} />
                    <span
                      className={
                        safeValue === 'ok'
                          ? 'text-green-600 font-medium'
                          : safeValue === 'warn'
                          ? 'text-yellow-600 font-medium'
                          : 'text-red-600 font-medium'
                      }
                    >
                      {safeValue === 'ok' ? 'OK' : safeValue === 'warn' ? 'Warnung' : 'Fehler'}
                    </span>
                  </div>

                  {/* DB-Details */}
                  {isDb && status.db.sizePretty && (
                    <div className="text-xs text-gray-500 ml-12">
                      Speicherverbrauch: <span className="font-medium">{status.db.sizePretty}</span>
                      {typeof status.db.sizePercent === 'number' && (
                        <> ({status.db.sizePercent}% von 10 GB)</>
                      )}
                    </div>
                  )}

                  {isDb && Array.isArray(status.warnings) && status.warnings.length > 0 && (
                    <div className="text-xs text-yellow-600 mt-1 ml-12">
                      ⚠️ {status.warnings.join(', ')}
                    </div>
                  )}

                  {isDb && Array.isArray(status.db.topTables) && status.db.topTables.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2 ml-12 space-y-1">
                      <div className="font-medium text-gray-600">Größte Tabellen:</div>
                      {status.db.topTables.map((t, i) => (
                        <div key={i} className="flex justify-between pr-2">
                          <span>{t.name}</span>
                          <span className="tabular-nums">{(t.sizeBytes / 1024).toFixed(1)} kB</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Google Analytics */}
            <div className={`relative flex items-start gap-3 bg-white rounded-2xl shadow-md p-4 border ${
              gaStatus === 'ok'
                ? 'border-green-100'
                : gaStatus === 'warn'
                ? 'border-yellow-100'
                : 'border-red-200'
            }`}>
              <span className="bg-blue-50 rounded-full p-2 flex items-center justify-center mt-1">
                <BarChart2 className="w-5 h-5 text-blue-600" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Google Analytics</span>
                  <Tooltip>
                    Analytics wird nur bei aktivem Cookie-Consent für „Statistik“ geladen.
                    Die IP-Adresse wird dabei anonymisiert.
                  </Tooltip>
                </div>
                {gaStatus === 'ok' && (
                  <p className="text-xs text-gray-500 mt-1">IP-Anonymisierung ist aktiviert.</p>
                )}
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <StatusSymbol status={gaStatus} />
                <span className={`mt-2 text-xs ${
                  gaStatus === 'ok'
                    ? 'text-green-600'
                    : gaStatus === 'warn'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                } font-medium`}>
                  {gaStatus === 'ok' ? 'Aktiv' : gaStatus === 'warn' ? 'Blockiert' : 'Fehler'}
                </span>
              </div>
            </div>

            {/* Marketing */}
            <div className={`relative flex items-center gap-3 bg-white rounded-2xl shadow-md p-4 border ${
              marketingStatus === 'ok'
                ? 'border-green-100'
                : marketingStatus === 'warn'
                ? 'border-yellow-100'
                : 'border-red-200'
            }`}>
              <span className="bg-blue-50 rounded-full p-2 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-blue-600" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Marketing-Zustimmung</span>
                  <Tooltip>
                    Wird benötigt für Werbe-Cookies, Retargeting oder eingebettete Dienste wie YouTube.
                  </Tooltip>
                </div>
              </div>
              <StatusSymbol status={marketingStatus} />
              <span className={`text-xs ${
                marketingStatus === 'ok'
                  ? 'text-green-600'
                  : marketingStatus === 'warn'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              } font-medium`}>
                {marketingStatus === 'ok' ? 'Aktiv' : marketingStatus === 'warn' ? 'Blockiert' : 'Fehler'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-red-500 text-center py-8">Fehler beim Laden des Status.</div>
        )}

        {status?.serverTime && (
          <div className="text-xs text-gray-400 mt-8 text-center">
            Serverzeit: {new Date(status.serverTime).toLocaleString()}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={resetConsent}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded shadow-sm text-gray-700"
          >
            <RefreshCcw className="w-4 h-4" />
            Cookie-Einstellungen zurücksetzen
          </button>
        </div>
      </div>
    </SuperadminLayout>
  );
}
