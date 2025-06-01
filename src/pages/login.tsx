/* pages/login.tsx */

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
    <div className="login-wrapper">
      <form onSubmit={handleLogin} className="card form-box">
        <h2 className="form-title">Anmelden</h2>

        <div>
          <label className="form-label" htmlFor="email">E-Mail</label>
          <div className="input-box">
            <Mail className="input-icon" />
            <input
              id="email"
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="password">Passwort</label>
          <div className="input-box">
            <Lock className="input-icon" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="input-field"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="eye-btn"
              title={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary">
          <LogIn className="w-5 h-5" /> Login
        </button>

        <div className="form-divider">
          <span className="divider-line" />
          <span className="divider-text">oder</span>
          <span className="divider-line" />
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="google-btn"
          >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Mit Google anmelden
        </button>

        <div className="form-links">
          <a href="/reset-request" className="link-blue">Passwort vergessen?</a>
          <span className="link-hint">Für alle, die lieber selbst klicken:</span>
          <a href="/register" className="link-blue inline-flex items-center gap-1 font-semibold justify-center">
            <UserPlus className="w-4 h-4" /> Registrieren <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </form>
    </div>
  );
}
