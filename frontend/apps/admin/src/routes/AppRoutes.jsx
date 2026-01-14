import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, ForgotPasswordPage } from '@booking/shared';
import AdminHomePage from '../pages/AdminHomePage.jsx';
import AdminUsersPage from '../pages/AdminUsersPage.jsx';
import AdminProfilePage from '../pages/AdminProfilePage.jsx';
import AdminSuperCourtsPage from '../pages/AdminSuperCourtsPage.jsx';
import AdminBookingsPage from '../pages/AdminBookingsPage.jsx';
import { RequireAdminAuth } from '@booking/shared/middleware/auth-role.js';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage defaultSite="admin" />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/"
        element={
          <RequireAdminAuth>
            <AdminHomePage />
          </RequireAdminAuth>
        }
      />
      <Route
        path="/users"
        element={
          <RequireAdminAuth>
            <AdminUsersPage />
          </RequireAdminAuth>
        }
      />
      <Route
        path="/supper-courts"
        element={
          <RequireAdminAuth>
            <AdminSuperCourtsPage />
          </RequireAdminAuth>
        }
      />
      <Route
        path="/bookings"
        element={
          <RequireAdminAuth>
            <AdminBookingsPage />
          </RequireAdminAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAdminAuth>
            <AdminProfilePage />
          </RequireAdminAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
