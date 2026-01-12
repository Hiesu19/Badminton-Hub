import React from 'react';
import { Navigate } from 'react-router-dom';

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const hasValidToken = () =>
  typeof window !== 'undefined' &&
  Boolean(localStorage.getItem('accessToken')) &&
  Boolean(localStorage.getItem('refreshToken'));

const loginRedirect = React.createElement(Navigate, {
  to: '/login',
  replace: true,
});

const createRoleGuard =
  (expectedRole) =>
  ({ children }) => {
    const hasToken = hasValidToken();
    const user = getStoredUser();

    if (!hasToken || user?.role !== expectedRole) {
      return loginRedirect;
    }

    return children;
  };

export const RequireAdminAuth = createRoleGuard('super_admin');
export const RequireOwnerAuth = createRoleGuard('owner');
export const RequireUserAuth = createRoleGuard('user');
