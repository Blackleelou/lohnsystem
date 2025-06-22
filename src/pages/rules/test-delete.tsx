// src/pages/test-delete.tsx
import { useState } from 'react'

export default function TestDelete() {
  const [output, setOutput] = useState<string>('')

  async function handleDelete() {
    const id = prompt('Welche Rule-ID möchtest du löschen?')
    if (!id) return setOutput('Keine ID angegeben.')
    try {
      const res = await fetch(`/api/rules/${id}`, { method: 'DELETE' })
      setOutput(`Response-Status: ${res.status}`)
    } catch (e: any) {
      setOutput(`Error: ${e.message}`)
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🧪 Test Delete API</h1>
      <button onClick={handleDelete} style={{ padding: '8px 16px', fontSize: 16 }}>
        Rule löschen
      </button>
      <pre style={{ marginTop: 20, background: '#f0f0f0', padding: 10 }}>
        {output}
      </pre>
    </div>
  )
}
