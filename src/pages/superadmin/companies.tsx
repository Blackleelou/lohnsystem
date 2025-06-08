import { useEffect, useState } from 'react';
import SuperadminLayout from '@/components/superadmin/SuperadminLayout';

type Company = {
  id: string;
  name: string;
  createdAt: string;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Firmen abrufen
  const fetchCompanies = () => {
    fetch('/api/admin/companies')
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
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

  return (
    <SuperadminLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Firmenübersicht</h1>
        <div className="bg-white rounded-xl shadow p-4">
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
      </div>
    </SuperadminLayout>
  );
}
