import { useEffect, useState } from "react";
import TeamLayout from "@/components/team/TeamLayout";
import { useSession } from "next-auth/react";

type Member = {
  id: string;
  name?: string | null;
  nickname?: string | null;
  email: string;
  role?: string | null;
  invited?: boolean;
  accepted?: boolean;
};

export default function TeamMembersPage() {
  const { data: session, status } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/team/members")
      .then(res => res.json())
      .then(data => setMembers(data.members || []))
      .finally(() => setLoading(false));
  }, [status]);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.nickname?.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    );
  });

  const handleRemove = async (id: string) => {
    const confirmRemove = confirm("Diesen Benutzer wirklich aus dem Team entfernen?");
    if (!confirmRemove) return;

    const res = await fetch("/api/team/remove-member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });

    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } else {
      alert("Fehler beim Entfernen.");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const res = await fetch("/api/team/change-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });

    if (res.ok) {
      setMembers((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
      );
    } else {
      alert("Rollenänderung fehlgeschlagen.");
    }
  };

  const getStatus = (m: Member) => {
    if (m.invited && !m.accepted) return { text: "Eingeladen", color: "text-yellow-600" };
    return { text: "Aktiv", color: "text-green-600" };
  };

  const getInitials = (m: Member) => {
    const name = m.nickname || m.name || m.email;
    return name
      .split(" ")
      .map(part => part[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <TeamLayout>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Teammitglieder</h1>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suche nach Name, E-Mail oder Nickname"
            className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-sm"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Lade Mitglieder…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Keine Mitglieder gefunden.</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left bg-gray-100 dark:bg-gray-800">
                <th className="p-2 border-b">Avatar</th>
                <th className="p-2 border-b">Name</th>
                <th className="p-2 border-b">Nickname</th>
                <th className="p-2 border-b">E-Mail</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b">Rolle</th>
                <th className="p-2 border-b">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const status = getStatus(m);
                return (
                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-2 border-b">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {getInitials(m)}
                      </div>
                    </td>
                    <td className="p-2 border-b">{m.name || "—"}</td>
                    <td className="p-2 border-b">{m.nickname || "—"}</td>
                    <td className="p-2 border-b">{m.email}</td>
                    <td className={`p-2 border-b ${status.color}`}>{status.text}</td>
                    <td className="p-2 border-b">
                      {session?.user?.role === "admin" ? (
                        <select
                          value={m.role ?? "viewer"}
                          onChange={(e) => handleRoleChange(m.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-800"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      ) : (
                        <span className="text-xs text-gray-500 italic">{m.role || "viewer"}</span>
                      )}
                    </td>
                    <td className="p-2 border-b">
                      {session?.user?.role === "admin" ? (
                        <button
                          onClick={() => handleRemove(m.id)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Entfernen
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Keine Berechtigung</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </TeamLayout>
  );
}
