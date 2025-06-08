import { useEffect, useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';

// Firmen-Liste Typ
type Company = {
  id: string;
  name: string;
  createdAt: string;
};

export default function CompanyAdmin() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Firmenliste vom Backend laden
  useEffect(() => {
    fetch('/api/superadmin/companies')
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []));
  }, []);

  // Umbenennen
  async function handleRename(id: string) {
    if (!newName.trim()) return;
    setLoading(true);
    const res = await fetch('/api/superadmin/company/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: id, newName: newName.trim() }),
    });
    if (res.ok) {
      setCompanies((companies) =>
        companies.map((c) => (c.id === id ? { ...c, name: newName } : c))
      );
      setEditingId(null);
    }
    setLoading(false);
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg max-w-2xl mx-auto my-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Firmenverwaltung</h2>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {companies.length === 0 && (
          <div className="py-8 text-gray-400 text-center">Keine Firmen gefunden.</div>
        )}
        {companies.map((company) => (
          <div key={company.id} className="flex items-center py-4 gap-3">
            <span className="flex-1 flex items-center gap-2 text-lg">
              <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg px-3 py-1 text-xs font-semibold">
                {/* Icon kann angepasst werden */}
                <Pencil className="w-4 h-4 mr-1" />
                {editingId === company.id ? (
                  <input
                    className="bg-transparent border-b border-blue-400 text-lg font-semibold focus:outline-none px-1 py-0.5"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span className="font-semibold">{company.name}</span>
                )}
              </span>
            </span>
            <span className="text-xs text-gray-500 px-2">
              {new Date(company.createdAt).toLocaleDateString()}
            </span>
            {editingId === company.id ? (
              <>
                <button
                  className="ml-2 p-1 rounded-lg bg-green-500 text-white hover:bg-green-600"
                  disabled={loading}
                  onClick={() => handleRename(company.id)}
                  title="Speichern"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  className="ml-1 p-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => setEditingId(null)}
                  title="Abbrechen"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                className="ml-2 p-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800"
                onClick={() => {
                  setEditingId(company.id);
                  setNewName(company.name);
                }}
                title="Umbenennen"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
