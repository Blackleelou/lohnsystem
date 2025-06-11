import { useEffect, useState } from 'react';
import SuperadminLayout from '@/components/superadmin/SuperadminLayout';

type Company = {
  id: string;
  name: string;
  createdAt: string;
};

type Invitation = {
  id: string;
  token: string;
  type: string;
  password: string | null;
  createdAt: string;
  expiresAt: string;
  companyId: string;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [loadingInvites, setLoadingInvites] = useState(true);

  // Firmen abrufen
  const fetchCompanies = () => {
    fetch('/api/admin/companies')
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      });
  };

  // QR-Einladungen abrufen
  const fetchInvitations = () => {
    fetch('/api/superadmin/all-qr-invitations')
      .then((res) => res.json())
      .then((data) => {
        setInvitations(data.invitations);
        setLoadingInvites(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
    fetchInvitations();
  }, []);

  // Firma löschen
  const handleDelete = async (id: string) => {
    if (!window.confirm('Willst du diese Firma wirklich löschen?')) return;
    const res = await fetch(`/api/admin/companies/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert('Fehler beim Löschen!');
    }
  };

  // Alle Einladungen löschen
  const deleteAllInvites = async () => {
    if (!window.confirm('Willst du wirklich ALLE Einladungen im System löschen?')) return;
    setDeleting(true);

    const res = await fetch('/api/superadmin/delete-all-invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    setDeleting(false);

    if (res.ok) {
      const data = await res.json();
      alert(`✅ ${data.deletedCount} Einladungen gelöscht.`);
      fetchInvitations(); // Liste aktualisieren
    } else {
      alert('❌ Fehler beim Löschen.');
    }
  };

  return (
    <SuperadminLayout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Firmenübersicht</h1>

        <div className="bg-white rounded-xl shadow p-4 mb-10">
          {loading ? (
            <div className="text-gray-400 text-center">Lade Firmen...</div>
          ) : companies.length === 0 ? (
            <div className="text-gray-400 text-center">Keine Firmen vorhanden</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left">Firmenname</th>
                  <th className="px-3 py-2 text-left">Erstellt am</th>
                  <th className="px-3 py-2 text-center">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-t hover:bg-blue-50">
                    <td className="px-3 py-2">{company.name}</td>
                    <td className="px-3 py-2">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(company.id)}
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Alle Einladungen löschen */}
        <div className="text-center mb-10">
          <button
            onClick={deleteAllInvites}
            disabled={deleting}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded text-sm"
          >
            {deleting ? 'Lösche...' : '🔥 Alle Einladungen systemweit löschen'}
          </button>
        </div>

        {/* QR-Codes Übersicht */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Vorhandene QR-Codes</h2>
          {loadingInvites ? (
            <p className="text-gray-400">Lade QR-Codes...</p>
          ) : invitations.length === 0 ? (
            <p className="text-sm text-gray-500">Keine QR-Einladungen vorhanden</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left">Typ</th>
                    <th className="px-3 py-2 text-left">Token</th>
                    <th className="px-3 py-2 text-left">Firma</th>
                    <th className="px-3 py-2 text-left">Erstellt</th>
                    <th className="px-3 py-2 text-left">Ablauf</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((inv) => (
                    <tr key={inv.id} className="border-t hover:bg-blue-50">
                      <td className="px-3 py-1">{inv.type}</td>
                      <td className="px-3 py-1 font-mono text-xs break-all">{inv.token}</td>
                      <td className="px-3 py-1">{inv.companyId}</td>
                      <td className="px-3 py-1">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-1">{new Date(inv.expiresAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SuperadminLayout>
  );
}
