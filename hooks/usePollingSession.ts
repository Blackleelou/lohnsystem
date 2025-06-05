// src/hooks/usePollingSession.ts

import { useSession, UseSessionOptions } from "next-auth/react";

export function usePollingSession() {
  // UseSessionOptions<false> → required = false (Session muss nicht zwingend existieren)
  const options: UseSessionOptions<false> = {
    required: false,
    refetchInterval: 30,         // alle 30 Sekunden frisch abrufen
    refetchOnWindowFocus: true,   // sofort neu abrufen, wenn Tab fokussiert
  };

  return useSession(options);
}
