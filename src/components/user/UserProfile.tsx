import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserProfile() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    steuerklasse: '1',
    kirche: false,
    kinderfreibetrag: '0',
    iban: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/user/profile').then((res) => {
      setForm(res.data);
    });
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePasswordChange = (e: any) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/user/update', form);
      setMessage('Profil gespeichert.');
      setError('');
    } catch {
      setError('Fehler beim Speichern.');
      setMessage('');
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Neue Passwörter stimmen nicht überein.');
      return;
    }
    try {
      await axios.post('/api/user/change-password', passwordForm);
      setMessage('Passwort geändert.');
      setError('');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setError('Fehler beim Ändern des Passworts.');
      setMessage('');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('/api/user/delete');
      toast.success('Dein Konto wurde gelöscht.');
      setTimeout(() => router.push('/login'), 2500);
    } catch {
      toast.error('Konnte Konto nicht löschen.');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Mein Profil</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="firstname"
          placeholder="Vorname"
          className="border p-2 rounded"
          value={form.firstname}
          onChange={handleChange}
        />
        <input
          name="lastname"
          placeholder="Nachname"
          className="border p-2 rounded"
          value={form.lastname}
          onChange={handleChange}
        />
        <select
          name="steuerklasse"
          className="border p-2 rounded"
          value={form.steuerklasse}
          onChange={handleChange}
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>{`Steuerklasse ${num}`}</option>
          ))}
        </select>
        <input
          name="kinderfreibetrag"
          type="number"
          step="0.5"
          min="0"
          placeholder="Kinderfreibetrag"
          className="border p-2 rounded"
          value={form.kinderfreibetrag}
          onChange={handleChange}
        />
        <label className="flex items-center col-span-2 gap-2">
          <input type="checkbox" name="kirche" checked={form.kirche} onChange={handleChange} />
          Kirchensteuerpflichtig
        </label>
        <input
          name="iban"
          placeholder="IBAN (optional)"
          className="border p-2 rounded col-span-2"
          value={form.iban}
          onChange={handleChange}
        />
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4" onClick={handleSubmit}>
        Speichern
      </button>

      <hr className="my-6" />

      <h3 className="font-semibold mb-2">Passwort ändern</h3>
      <input
        name="oldPassword"
        type="password"
        placeholder="Altes Passwort"
        className="border p-2 rounded w-full mb-2"
        value={passwordForm.oldPassword}
        onChange={handlePasswordChange}
      />
      <input
        name="newPassword"
        type="password"
        placeholder="Neues Passwort"
        className="border p-2 rounded w-full mb-2"
        value={passwordForm.newPassword}
        onChange={handlePasswordChange}
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Neues Passwort wiederholen"
        className="border p-2 rounded w-full mb-2"
        value={passwordForm.confirmPassword}
        onChange={handlePasswordChange}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleChangePassword}>
        Passwort ändern
      </button>

      <hr className="my-6" />

      <button
        className="bg-red-600 text-white px-4 py-2 rounded w-full"
        onClick={handleDeleteAccount}
      >
        Konto löschen
      </button>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
