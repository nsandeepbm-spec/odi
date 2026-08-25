import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../lib/auth';
import { ODILoader } from '../ODILoader';

/**
 * Protects dashboard routes. Waits for Firebase + profile load,
 * then redirects to /login if not signed in.
 */
export function RequireAuth({ adminOnly = false }: { adminOnly?: boolean }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <ODILoader variant="full" size="md" label="Loading account…" />;
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
