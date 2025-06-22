// src/pages/rules/[id].tsx

// Diese Route soll nicht statisch vorgerendert werden.
// Wir liefern per SSR direkt einen 404 zurück.
export const getServerSideProps = async () => {
  return { notFound: true }
}

export default function RuleNotFoundPage() {
  return null
}
