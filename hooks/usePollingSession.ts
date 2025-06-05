// src/hooks/usePollingSession.ts

import { useSession, UseSessionOptions } from "next-auth/react";

export function usePollingSession() {
  const options: UseSessionOptions = {
    required: false,
    refetchInterval: 30 * 1000, // alle 30 Sekunden neu laden
    onWindowFocus: true,         // sofort erneuter Fetch beim Zurück‐Switch in den Tab
  };
  return useSession(options);
}
