import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieAccepted');
    if (!accepted) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 text-center z-[9999]">
      <p className="mb-2">Wir verwenden Cookies, um die Nutzererfahrung zu verbessern.</p>
      <button
        onClick={acceptCookies}
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
      >
        Verstanden
      </button>
    </div>
  );
}
