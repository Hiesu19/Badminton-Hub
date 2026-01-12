import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, ForgotPasswordPage } from '@booking/shared';
import AdminHomePage from '../pages/AdminHomePage.jsx';
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
