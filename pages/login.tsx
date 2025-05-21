import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push('/dashboard');
    } else {
      if (res?.error?.includes('E-Mail')) {
        setError('Bitte bestätige zuerst deine E-Mail-Adresse.');
      } else {
        setError('Benutzername oder Passwort ist ungültig.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Anmelden</h2>

        <div className="mb-4 relative">
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <img
            src={showPassword ? "/eye-open.png" : "/eye-closed.png"}
            alt="Toggle visibility"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 w-5 h-5 cursor-pointer transform -translate-y-1/2"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* Trennlinie mit Text */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">oder</span>
          </div>
        </div>

        {/* Google Login Button mit Icon */}
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.4-1.6-34.2-4.6-50.4H272v95.3h147.3c-6.3 34-25 62.7-53.3 82v67h86.2c50.4-46.4 81.3-114.9 81.3-193.9z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c72.9 0 134.1-24.1 178.8-65.5l-86.2-67c-24 16-54.7 25.4-92.6 25.4-71.2 0-131.5-48-153.2-112.4H31.7v70.5c44.8 89 137.5 149 240.3 149z"
              fill="#34A853"
            />
            <path
              d="M118.8 324.8c-10.5-31.5-10.5-65.6 0-97.1V157.2H31.7c-38.9 77.8-38.9 170.1 0 247.9l87.1-70.3z"
              fill="#FBBC05"
            />
            <path
              d="M272 107.7c39.6-.6 77.4 14 106.3 40.4l79.4-79.4C416.1 24.3 345.5-2.4 272 0 169.3 0 76.5 60 31.7 149l87.1 70.2c21.7-64.4 82-112.4 153.2-111.5z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Mit Google anmelden
          </span>
        </button>

        <p className="text-center text-sm mt-4">
          <a href="/reset-request" className="text-blue-600 hover:underline">
            Passwort vergessen?
          </a>
        </p>

        <p className="text-center text-sm mt-6 text-gray-600">
          Für alle, die lieber selbst klicken:{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Registrieren
          </a>
        </p>
      </form>
    </div>
  );
}
