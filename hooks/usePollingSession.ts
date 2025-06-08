// src/hooks/usePollingSession.ts
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function usePollingSession() {
  // Standard-useSession ohne Spezial-Optionen
  const { data: session, status, update } = useSession({ required: false });

  useEffect(() => {
    // Sobald der User eingeloggt ist, führt update() alle 30 Sekunden aus
    if (status === 'authenticated') {
      const iv = setInterval(() => {
        update(); // holt sich die frischeste Session vom Server
      }, 30 * 1000);

      // Beim Unmount/Cleanup den Timer stoppen
      return () => clearInterval(iv);
    }
    // falls nicht eingeloggt → kein Intervall
    return;
  }, [status, update]);

  return { data: session, status };
}
