// src/hooks/usePollingSession.ts

import { useSession, UseSessionOptions } from "next-auth/react";

export function usePollingSession() {
  // UseSessionOptions<false> => required=false (darf nicht eingeloggt sein)
  const options: UseSessionOptions<false> = {
    required: false,
    keepAlive: 30,        // alle 30 Sekunden eine neue Session-Abfrage
    revalidateOnFocus: true, // sofort neu abfragen, wenn Nutzer den Tab fokussiert
  };

  return useSession(options);
}
