import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import { Users, UserPlus, Settings, MoreHorizontal } from "lucide-react";

export default function CompanyModePage() {
  const { data: session } = useSession();
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    if (session?.user?.mode === "company") {
      fetch("/api/company")
        .then(res => res.json())
        .then(data => {
          if (data.companyName) setCompanyName(data.companyName);
        });
    }
  }, [session]);

  // Menü-Punkte als Modularray für easy Erweiterung
  const menu = [
    {
      key: "members",
      label: "Mitglieder",
      icon: <Users className="w-4 h-4 mr-2" />,
    },
    {
      key: "invites",
      label: "Einladungen",
      icon: <UserPlus className="w-4 h-4 mr-2" />,
    },
    {
      key: "settings",
      label: "Einstellungen",
      icon: <Settings className="w-4 h-4 mr-2" />,
    },
    {
      key: "more",
      label: "Mehr",
      icon: <MoreHorizontal className="w-4 h-4 mr-2" />,
    },
  ];

  // Aktueller Tab (funktioniert später!)
  const [current, setCurrent] = useState("members");

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-10 px-4">
        {/* Headline und Firmenname */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1 text-xs font-semibold shadow">
              <Users className="w-5 h-5 mr-1" /> 
              {companyName ? companyName : "Deine Firma"}
            </span>
          </div>
          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded ml-2 shadow-sm tracking-wide font-medium">
            Firmamodus aktiv
          </span>
        </div>

        {/* Menüleiste als Tabs */}
        <div className="flex gap-1 mb-10 border-b border-gray-200 dark:border-gray-700">
          {menu.map(tab => (
            <button
              key={tab.key}
              className={`flex items-center px-4 py-2 rounded-t-xl font-medium text-sm transition
                ${current === tab.key
                  ? "bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500"
                  : "bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-blue-500 hover:bg-white/60 dark:hover:bg-gray-700/60"}`
              }
              onClick={() => setCurrent(tab.key)}
              type="button"
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Zentralfläche Platzhalter */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-900/70 p-8 text-center shadow-sm min-h-[200px] flex items-center justify-center">
          <span className="text-gray-400 dark:text-gray-500 text-lg">
            {/* Platzhalter je nach Tab */}
            {current === "members" && "Hier siehst du später alle Teammitglieder deiner Firma."}
            {current === "invites" && "Einladungen verwalten (kommt demnächst!)"}
            {current === "settings" && "Firmeneinstellungen und Rechte werden bald verfügbar sein."}
            {current === "more" && "Weitere Tools und Statistiken folgen."}
          </span>
        </div>
      </div>
    </Layout>
  );
}
