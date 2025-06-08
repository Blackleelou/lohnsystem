import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PasswordReset() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const urlToken = router.query.token as string;
    if (urlToken) {
      setToken(urlToken);
    }
  }, [router.query.token]);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwörter stimmen nicht überein.');
      return;
    }

    try {
      await axios.post('/api/user/reset-confirm', {
        token,
        newPassword,
      });
      setMessage('Passwort wurde erfolgreich zurückgesetzt.');
      setError('');
    } catch (err) {
      setError('Fehler beim Zurücksetzen des Passworts.');
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Passwort zurücksetzen</h2>

      <input
        type="password"
        placeholder="Neues Passwort"
        className="border p-2 rounded w-full mb-2"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Neues Passwort wiederholen"
        className="border p-2 rounded w-full mb-4"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={handleSubmit}>
        Passwort setzen
      </button>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
