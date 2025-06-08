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
  const [invitationValid, setInvitationValid] = useState(false);
  const [requirePassword, setRequirePassword] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [consentData, setConsentData] = useState<{
    nickname: string;
    showName: boolean;
    showEmail: boolean;
    showNickname: boolean;
  } | null>(null);

  const [stage, setStage] = useState<'checking' | 'waitingPassword' | 'waitingConsent' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('');

  const { data: session, status: sessionStatus, update } = useSession({ required: false });

  useEffect(() => {
    const handle = setInterval(() => update(), 30 * 1000);
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
    }
  }, [token, session, sessionStatus, router]);

  useEffect(() => {
    if (!session || !token || sessionStatus !== 'authenticated' || joined) return;

    const runValidation = async () => {
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
        setRequirePassword(data.requirePassword || false);

        if (
          session?.user?.role &&
          data?.role &&
          ['admin', 'editor'].includes(session.user.role) &&
          session.user.role !== data.role
        ) {
          setStage('error');
          setMessage('⚠️ Einladung verweigert: Du würdest dich selbst zurückstufen.');
          return;
        }

        if (data.requirePassword) {
          setStage('waitingPassword');
        } else {
          setInvitationValid(true);
          setStage('waitingConsent');
        }
      } catch (error) {
        console.error('Fehler bei Einladung:', error);
        setStage('error');
        setMessage('Ein unerwarteter Fehler ist aufgetreten.');
      }
    };

    runValidation();
  }, [session, token, sessionStatus, joined]);

  const verifyPassword = async () => {
    try {
      const res = await fetch('/api/team/verify-access-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: enteredPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data?.error || 'Passwort falsch oder abgelaufen');
        return;
      }

      setInvitationValid(true);
      setStage('waitingConsent');
    } catch (err) {
      console.error('Fehler bei Passwortprüfung:', err);
      setMessage('Ein unerwarteter Fehler ist aufgetreten.');
    }
  };

  useEffect(() => {
    if (!invitationValid || !consentData || joined) return;

    const joinTeam = async () => {
      try {
        const res = await fetch('/api/team/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, ...consentData }),
        });

        if (!res.ok) {
          const err = await res.json();
          setStage('error');
          setMessage(err?.error || 'Beitritt fehlgeschlagen.');
          return;
        }

        const data = await res.json();
        if (data?.success) {
          setJoined(true);
          setStage('success');
          setMessage('Du wurdest erfolgreich zum Team hinzugefügt. Weiterleitung…');
          update();
          setTimeout(() => router.push('/dashboard'), 2500);
        } else {
          setStage('error');
          setMessage(data?.error || 'Einladung konnte nicht verarbeitet werden.');
        }
      } catch (err) {
        console.error('Beitritt fehlgeschlagen:', err);
        setStage('error');
        setMessage('Ein unerwarteter Fehler ist aufgetreten.');
      }
    };

    joinTeam();
  }, [invitationValid, consentData, joined, token, router, update]);

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

  if (stage === 'waitingPassword') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md bg-white p-6 rounded shadow space-y-4">
          <h1 className="text-lg font-bold">Passwort erforderlich</h1>
          <p className="text-sm text-gray-600">Diese Einladung erfordert ein temporäres Passwort.</p>
          <input
            type="text"
            placeholder="Passwort eingeben"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            onClick={verifyPassword}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Prüfen
          </button>
          {message && <p className="text-sm text-red-500">{message}</p>}
        </div>
      </div>
    );
  }

  if (stage === 'waitingConsent' || (invitationValid && !consentData)) {
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

  if (stage === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md bg-white p-6 rounded shadow">
          <h1 className="text-green-600 font-bold text-xl mb-2">Beitritt erfolgreich</h1>
          <p>{message}</p>
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

  return null;
}
