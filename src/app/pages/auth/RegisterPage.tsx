import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { registerWithEmail, signInWithGoogle, authErrorMessage } from '../../lib/firebase';
import { syncUserWithBackend } from '../../lib/api';

const T = {
  text: '#111827',
  sub: '#6B7280',
  border: '#E5E7EB',
  inputBg: '#F8FAFC',
  link: '#2563EB',
  navy: '#0F172A',
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function safeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}

const fieldCls =
  'w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'email' | 'google' | null>(null);

  const finishSignup = async (user: Parameters<typeof syncUserWithBackend>[0]) => {
    await syncUserWithBackend(user);
    navigate(safeRedirect(searchParams.get('redirect')));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading('email');
    try {
      const credential = await registerWithEmail(fullName.trim(), email, password);
      await finishSignup(credential.user);
    } catch (err) {
      setError(authErrorMessage(err));
      setLoading(null);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading('google');
    try {
      const credential = await signInWithGoogle();
      await finishSignup(credential.user);
    } catch (err) {
      setError(authErrorMessage(err));
      setLoading(null);
    }
  };

  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-x-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <div
        className="fixed inset-0 bg-cover bg-no-repeat bg-[position:62%_center] sm:bg-[position:55%_center] lg:bg-center"
        style={{ backgroundImage: "url('/login.png')" }}
        aria-hidden
      />
      <div
        className="fixed inset-0 pointer-events-none lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,10,24,0.45) 0%, rgba(6,10,24,0.55) 40%, rgba(6,10,24,0.7) 100%)',
        }}
        aria-hidden
      />

      <div
        className={[
          'relative z-10 flex items-stretch sm:items-center justify-center',
          'min-h-[100dvh]',
          'px-0 py-0 sm:px-6 sm:py-12',
          'md:justify-end md:pr-8 md:pl-6',
          'lg:pr-[16%] xl:pr-[18%] 2xl:pr-[20%]',
          'sm:pt-[max(2.5rem,env(safe-area-inset-top))]',
          'sm:pb-[max(2.5rem,env(safe-area-inset-bottom))]',
        ].join(' ')}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full sm:max-w-[min(100%,460px)] flex flex-col justify-end sm:justify-center min-h-[100dvh] sm:min-h-0"
        >
          <div
            className={[
              'bg-white sm:bg-white/98 sm:backdrop-blur-sm',
              'w-full flex-1 sm:flex-none',
              'rounded-none sm:rounded-2xl',
              'p-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]',
              'sm:p-7 md:p-8',
              'shadow-none sm:shadow-[0_24px_60px_rgba(0,0,0,0.35)]',
              'ring-0 sm:ring-1 sm:ring-black/5',
              'flex flex-col justify-center',
            ].join(' ')}
          >
            <header className="mb-5 sm:mb-7 text-left">
              <p
                className="text-[10px] font-bold tracking-[0.28em] uppercase mb-3 sm:mb-4"
                style={{ color: T.sub }}
              >
                Join ODI
              </p>
              <Link
                to="/"
                className="mb-2.5 sm:mb-3 inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 rounded-sm"
                aria-label="ODI home"
              >
                <img
                  src="/original-logo.png"
                  alt="ODI"
                  className="h-9 sm:h-10 md:h-11 w-auto object-contain"
                />
              </Link>
              <p className="text-[13px] sm:text-sm leading-relaxed" style={{ color: T.sub }}>
                Create an account to start your learning journey.
              </p>
            </header>

            <form onSubmit={handleRegister} className="space-y-3.5 sm:space-y-4">
              <div className="space-y-1.5">
                <label
                  className="text-[10px] font-bold tracking-[0.18em] uppercase"
                  style={{ color: T.sub }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
                    aria-hidden
                  />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className={`${fieldCls} min-h-[48px] text-base sm:text-sm`}
                    style={{ borderColor: T.border, color: T.text, background: T.inputBg }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-[10px] font-bold tracking-[0.18em] uppercase"
                  style={{ color: T.sub }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
                    aria-hidden
                  />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`${fieldCls} min-h-[48px] text-base sm:text-sm`}
                    style={{ borderColor: T.border, color: T.text, background: T.inputBg }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-[10px] font-bold tracking-[0.18em] uppercase"
                  style={{ color: T.sub }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
                    aria-hidden
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className={`${fieldCls} pr-11 min-h-[48px] text-base sm:text-sm`}
                    style={{ borderColor: T.border, color: T.text, background: T.inputBg }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-xl break-words">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading !== null}
                className="w-full mt-1 min-h-[48px] py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold tracking-wide text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
                style={{ background: T.navy }}
              >
                {loading === 'email' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account…
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-3 text-[11px] leading-relaxed text-center" style={{ color: '#9CA3AF' }}>
              By creating an account you agree to our{' '}
              <Link to="/terms" className="font-semibold underline underline-offset-2" style={{ color: T.text }}>
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-semibold underline underline-offset-2" style={{ color: T.text }}>
                Privacy Policy
              </Link>
              .
            </p>

            <div className="my-4 sm:my-5 flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: T.border }} />
              <span className="text-[11px] font-semibold tracking-wide text-neutral-400">OR</span>
              <div className="flex-1 h-px" style={{ background: T.border }} />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading !== null}
              className="w-full min-h-[48px] py-3.5 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold border bg-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              style={{ color: T.text, borderColor: T.border }}
            >
              {loading === 'google' ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>

            <div className="mt-5 sm:mt-6 space-y-3">
              <p className="text-center text-[13px] sm:text-sm" style={{ color: T.sub }}>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold hover:underline" style={{ color: T.link }}>
                  Sign in
                </Link>
              </p>
              <Link
                to="/"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" strokeWidth={2.25} />
                Back to home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
