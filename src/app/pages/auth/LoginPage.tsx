import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthShell, authInput } from './AuthShell';
import { signInWithEmail, signInWithGoogle, authErrorMessage } from '../../lib/firebase';
import { syncUserWithBackend } from '../../lib/api';

const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );
}

function safeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'email' | 'google' | null>(null);

  const finishLogin = async (user: Parameters<typeof syncUserWithBackend>[0]) => {
    await syncUserWithBackend(user);
    navigate(safeRedirect(searchParams.get('redirect')));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading('email');
    try {
      const credential = await signInWithEmail(email, password);
      await finishLogin(credential.user);
    } catch (err) {
      setError(authErrorMessage(err));
      setLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading('google');
    try {
      const credential = await signInWithGoogle();
      await finishLogin(credential.user);
    } catch (err) {
      setError(authErrorMessage(err));
      setLoading(null);
    }
  };

  return (
    <AuthShell
      headline="Step Back"
      accent="Into Orbit."
      tagline="Sign in to track your bookings, manage deliveries and be first in line for the next Explorer volume."
      points={['Track every booking live', 'Download invoices anytime', 'Early access to new volumes']}
    >
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: T.sub }}>
          Welcome Back
        </p>
        <h1
          className="font-black leading-none tracking-tight mb-3"
          style={{ fontSize: 'clamp(1.9rem, 3vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          Sign{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            In.
          </span>
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: T.sub }}>
          Enter your credentials to access your account.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading !== null}
        className="w-full py-3.5 flex items-center justify-center gap-3 text-sm font-semibold tracking-wide border transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        style={{ background: T.bg, color: T.text, borderColor: T.border }}
      >
        {loading === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>

      <div className="my-7 flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: T.border }} />
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#A3A3A3' }}>
          Or with email
        </span>
        <div className="flex-1 h-px" style={{ background: T.border }} />
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: T.sub }}>
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={authInput}
            style={{ borderColor: T.border }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: T.sub }}>
              Password
            </label>
            <Link to="#" className="text-xs font-semibold hover:underline" style={{ color: T.text }}>
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${authInput} pr-12`}
              style={{ borderColor: T.border }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors hover:opacity-70"
              style={{ color: T.sub }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading !== null}
          className="w-full py-4 flex items-center justify-center gap-2 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
          style={{ background: T.text, color: T.bg }}
        >
          {loading === 'email' && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading === 'email' ? 'Signing In…' : 'Sign In'}
        </button>
      </form>

      <div className="mt-10 flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: T.border }} />
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: '#A3A3A3' }}>
          New Here?
        </span>
        <div className="flex-1 h-px" style={{ background: T.border }} />
      </div>

      <Link
        to="/register"
        className="mt-6 w-full py-4 text-sm font-semibold tracking-wide border text-center block transition-transform hover:-translate-y-0.5"
        style={{ background: 'transparent', color: T.text, borderColor: T.border }}
      >
        Create an Account
      </Link>
    </AuthShell>
  );
}
