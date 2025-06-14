// lib/api/loadDocument.ts
export async function loadDocument(id: string) {
  const res = await fetch(`/api/editor/load?id=${id}`);
  if (!res.ok) {
    throw new Error("Fehler beim Laden des Dokuments");
  }
  const data = await res.json();
  return data.document;
}
