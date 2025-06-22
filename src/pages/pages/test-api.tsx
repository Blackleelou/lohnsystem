// pages/test-api.tsx
import { useState } from 'react'

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError]   = useState<string>('')

  async function callTestRule() {
    setError('')
    try {
      const res = await fetch('/api/test-rule', { method: 'POST' })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const json = await res.json()
      setResult(json)
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🧪 Test API</h1>
      <button onClick={callTestRule} style={{ padding: '8px 16px', fontSize: 16 }}>
        Regel anlegen
      </button>
      {error && <p style={{ color: 'red' }}>Fehler: {error}</p>}
      {result && (
        <pre style={{ background: '#f0f0f0', padding: 10, marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
