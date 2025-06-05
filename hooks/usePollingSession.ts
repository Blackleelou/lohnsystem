// src/hooks/usePollingSession.ts

import { useSession, UseSessionOptions } from "next-auth/react";

export function usePollingSession() {
  // UseSessionOptions erwartet hier einen generischen Typparameter, z.B. <false>, da wir "required: false" setzen
  const options: UseSessionOptions<false> = {
    required: false,
    refetchInterval: 30 * 1000, // alle 30 Sekunden neu laden
    onWindowFocus: true,        // direkt beim Zurück-wechseln in den Tab neu laden
  };

  return useSession(options);
}
