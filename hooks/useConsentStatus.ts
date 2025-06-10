import { useEffect, useState } from 'react';

export type ConsentState = {
  statistik: boolean;
  marketing: boolean;
};

export function useConsentStatus() {
  const [gaStatus, setGaStatus] = useState<'ok' | 'warn' | 'error'>('warn');
  const [marketingStatus, setMarketingStatus] = useState<'ok' | 'warn' | 'error'>('warn');
  const [consent, setConsent] = useState<ConsentState>({ statistik: false, marketing: false });

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('cookie-consent') || '{}');
      const statistik = raw.statistik === true;
      const marketing = raw.marketing === true;

      setConsent({ statistik, marketing });
      setGaStatus(statistik ? 'ok' : 'warn');
      setMarketingStatus(marketing ? 'ok' : 'warn');

      // send consent to API (diagnose only, no storage)
      fetch('/api/admin/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: { statistik, marketing } }),
      });
    } catch {
      setGaStatus('error');
      setMarketingStatus('error');
    }
  }, []);

  function resetConsent() {
    localStorage.removeItem('cookie-consent');
    location.reload();
  }

  return { gaStatus, marketingStatus, resetConsent };
}
