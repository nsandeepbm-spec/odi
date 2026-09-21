import React, { useState } from 'react';
import { Link } from 'react-router';
import { Loader2, MailCheck } from 'lucide-react';
import { AuthShell, authInput } from './AuthShell';
import { sendPasswordReset, authErrorMessage } from '../../lib/firebase';

const T = { bg: '#FFFFFF', bgAlt: '#F7F7F5', text: '#111111', sub: '#666666', border: '#E8E8E8' };

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendPasswordReset(email);
      // Always show success — do not reveal whether the email is registered
      setSent(true);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      // Treat unknown users the same as success (enumeration-safe)
      if (code === 'auth/user-not-found') {
        setSent(true);
      } else {
        setError(authErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      headline="Reset Your"
      accent="Access."
      tagline="We'll email you a secure link to set a new password. Your bookings and profile stay on the same account."
      points={[
        'One secure link to your inbox',
        'Same account & orders after reset',
        'Joined with Google? Use Continue with Google on sign-in',
      ]}
    >
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: T.sub }}>
          Account Recovery
        </p>
        <h1
          className="font-black leading-none tracking-tight mb-3"
          style={{ fontSize: 'clamp(1.9rem, 3vw, 2.75rem)', letterSpacing: '-0.03em' }}
        >
          Forgot{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Password?
          </span>
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: T.sub }}>
          Enter the email you used for email/password sign-in. If you joined with Google, use Google on the
          sign-in page instead.
        </p>
      </div>

      {sent ? (
        <div
          className="rounded-none border px-5 py-6 space-y-4"
          style={{ borderColor: T.border, background: T.bgAlt }}
        >
          <div className="flex items-start gap-3">
            <MailCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" aria-hidden />
            <div>
              <p className="text-sm font-bold text-neutral-900">Check your inbox</p>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: T.sub }}>
                If an account exists for <span className="font-semibold text-neutral-800">{email.trim()}</span>,
                we sent a password reset link. It may take a minute — also check spam.
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center py-4 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5"
            style={{ background: T.text, color: T.bg }}
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: T.sub }}>
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={authInput}
              style={{ borderColor: T.border }}
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 flex items-center justify-center gap-2 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
            style={{ background: T.text, color: T.bg }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <p className="mt-10 text-center text-sm" style={{ color: T.sub }}>
        Remembered it?{' '}
        <Link to="/login" className="font-semibold hover:underline" style={{ color: T.text }}>
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
