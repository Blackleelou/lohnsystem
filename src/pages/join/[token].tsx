import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import VisibilityConsentForm from '@/components/VisibilityConsentForm';

export default function JoinTokenPage() {
  const router = useRouter();
  const rawToken = router.query.token;
  const token =
    typeof rawToken === 'string' ? rawToken : Array.isArray(rawToken) ? rawToken[0] : null;

  const [companyName, setCompanyName] = useState<string | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [joined, setJoined] = useState(false);
  const [consentData, setConsentData] = useState<{
    nickname: string;
    showName: boolean;
    showEmail: boolean;
    showNickname: boolean;
  } | null>(null);

  const [stage, setStage] = useState<'checking' | 'waitingConsent' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('');

  const { data: session, status: sessionStatus, update } = useSession({ required: false });

  useEffect(() => {
    const handle = setInterval(() => {
      update();
    }, 30 * 1000);
    return () => clearInterval(handle);
  }, [update]);

  useEffect(() => {
    if (!token || token.length < 10) return;
    if (sessionStatus === 'loading') return;

    if (!session) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('joinToken', token);
      }
      router.push(`/login?callbackUrl=/join/${token}`);
      return;
    }

    const validateAndContinue = async () => {
      if (joined) {
        console.log('⛔ Join bereits abgeschlossen – keine weitere Validierung.');
        return;
      }

      setStage('checking');

      try {
        const res = await fetch(`/api/team/validate-invite?token=${token}`);
        if (!res.ok) {
          setStage('error');
          setMessage('Einladungslink ungültig oder abgelaufen.');
          return;
        }

        const data = await res.json();
        setCompanyName(data.companyName || null);

        // ⚠️ Selbst-Degradierung verhindern (z. B. admin → viewer)
        if (
          session?.user?.role &&
          data?.role &&
          ['admin', 'editor'].includes(session.user.role) &&
          session.user.role !== data.role
        ) {
          setStage('error');
          setMessage(
            '⚠️ Einladung verweigert: Du würdest dich selbst zurückstufen. Du wirst zur Teamübersicht weitergeleitet.'
          );
          setTimeout(() => {
            router.push('/team/members');
          }, 3000);
          return;
        }

        // Sichtbarkeitsabfrage nur, wenn noch nicht erfolgt
        if (!hasConsent || !consentData) {
          setStage('waitingConsent');
          return;
        }

        const joinRes = await fetch('/api/team/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, ...consentData }),
        });

        if (!joinRes.ok) {
          const err = await joinRes.json();
          setStage('error');
          setMessage(err?.error || 'Fehler beim Beitritt. Bitte versuche es erneut.');
          return;
        }

        const joinData = await joinRes.json();

        if (joinData?.success) {
          setJoined(true);
          setStage('success');
          setMessage('Du wurdest erfolgreich zum Team hinzugefügt. Weiterleitung…');
          update();
          setTimeout(() => router.push('/dashboard'), 2500);
        } else {
          setStage('error');
          setMessage(joinData?.error || 'Einladung fehlgeschlagen oder bereits verwendet.');
        }
      } catch (err) {
        console.error('Fehler beim Validieren oder Beitreten:', err);
        setStage('error');
        setMessage('Ein unerwarteter Fehler ist aufgetreten.');
      }
    };

    validateAndContinue();
  }, [token, session, sessionStatus, hasConsent, consentData, joined, router, update]);

  useEffect(() => {
    if (session && !token && typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('joinToken');
      if (storedToken) {
        router.replace(`/join/${storedToken}`);
      }
    }
  }, [session, token, router]);

  function handleConsentSubmit(data: {
    nickname: string;
    showName: boolean;
    showEmail: boolean;
    showNickname: boolean;
  }) {
    setConsentData(data);
    setHasConsent(true);
  }

  if (stage === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md bg-white p-6 rounded shadow">
          <p>Einladung wird geprüft…</p>
        </div>
      </div>
    );
  }

  if (stage === 'waitingConsent') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-gray-800">Willkommen bei meinLohn!</h1>
          {companyName && (
            <p className="text-gray-600">
              Du wurdest in das Team{' '}
              <span className="font-semibold text-gray-800">{companyName}</span> eingeladen.
            </p>
          )}
          <p className="text-gray-600">
            Bitte wähle, welche deiner Daten im Team sichtbar sein sollen:
          </p>
          <VisibilityConsentForm onSubmit={handleConsentSubmit} />
        </div>
      </div>
    );
  }

  if (stage === 'error') {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-red-600 font-bold text-xl mb-2">Fehler</h1>
        <p>{message}</p>

        {message.includes('zurückstufen') && (
          <button
            onClick={() => router.push('/team/members')}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Zur Teamübersicht
          </button>
        )}
      </div>
    </div>
  );
}
