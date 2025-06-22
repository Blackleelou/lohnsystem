// pages/rules/index.tsx
import useSWR from 'swr'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function RulesListPage() {
  const { data: rules, error, isLoading } = useSWR('/api/rules/rules', fetcher)

  if (error) return <p>Fehler beim Laden der Regeln.</p>
  if (isLoading) return <p>Lade Regeln…</p>
  if (!rules || rules.length === 0) return <p>Keine Regeln gefunden.</p>

  return (
    <div style={{ padding: 20 }}>
      <h1>Regel-Übersicht</h1>
      <Link href="/rules/new">
        <button style={{ marginBottom: 16 }}>+ Neue Regel</button>
      </Link>
      <table border={1} cellPadding={8} style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Aktiv</th>
            <th>Gültig von</th>
            <th>Gültig bis</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((r: any) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.active ? '✅' : '❌'}</td>
              <td>{new Date(r.validFrom).toLocaleDateString()}</td>
              <td>{r.validTo ? new Date(r.validTo).toLocaleDateString() : '-'}</td>
              <td>
                <Link href={`/rules/${r.id}/edit`}>
                  <button>Edit</button>
                </Link>{' '}
                <button
                  onClick={async () => {
                    if (!confirm('Regel wirklich löschen?')) return
                    await fetch(`/api/rules/${r.id}`, { method: 'DELETE' })
                    window.location.reload()
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
