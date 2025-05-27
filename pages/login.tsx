import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Eye, EyeOff, Mail, Lock, UserPlus, LogIn, ChevronRight } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-sm p-8 flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Anmelden</h2>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="email">
            E-Mail
          </label>
          <div className="flex items-center rounded-lg bg-blue-50 dark:bg-gray-800 px-3 py-2">
            <Mail className="w-4 h-4 mr-2 text-blue-400 dark:text-gray-500" />
            <input
              id="email"
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1" htmlFor="password">
            Passwort
          </label>
          <div className="flex items-center rounded-lg bg-blue-50 dark:bg-gray-800 px-3 py-2">
            <Lock className="w-4 h-4 mr-2 text-blue-400 dark:text-gray-500" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="ml-2 text-blue-400 dark:text-gray-400 focus:outline-none"
              title={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="flex items-center justify-center gap-2 py-2 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-bold shadow-md"
        >
          <LogIn className="w-5 h-5" /> Login
        </button>

        <div className="relative flex items-center my-2">
          <span className="flex-1 border-t border-gray-200 dark:border-gray-800"></span>
          <span className="mx-3 text-xs text-gray-400">oder</span>
          <span className="flex-1 border-t border-gray-200 dark:border-gray-800"></span>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition font-semibold shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Mit Google anmelden
        </button>

        <div className="flex flex-col gap-1 text-xs mt-2 text-center">
          <a href="/reset-request" className="text-blue-600 hover:underline">Passwort vergessen?</a>
          <span className="text-gray-400">Für alle, die lieber selbst klicken:</span>
          <a href="/register" className="inline-flex items-center text-blue-600 hover:underline font-semibold justify-center gap-1">
            <UserPlus className="w-4 h-4" /> Registrieren <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </form>
    </div>
  );
}
