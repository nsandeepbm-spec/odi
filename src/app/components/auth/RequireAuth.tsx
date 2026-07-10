import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth';

/**
 * Protects dashboard routes. Waits for Firebase + profile load,
 * then redirects to /login if not signed in.
 */
export function RequireAuth({ adminOnly = false }: { adminOnly?: boolean }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-neutral-400" />
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">
            Loading account…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

/** Admin-only guard for use with React Router `Component` route config. */
export function RequireAdmin() {
  return <RequireAuth adminOnly />;
}
