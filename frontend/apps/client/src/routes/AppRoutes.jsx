import { Routes, Route } from 'react-router-dom';
import {
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
} from '@booking/shared';
import ClientAuthLanding from '../pages/ClientAuthLanding.jsx';
import ClientMapsPage from '../pages/ClientMapsPage.jsx';
import ClientBookCourtPage from '../pages/ClientBookCourtPage.jsx';
import ClientHistoryPage from '../pages/ClientHistoryPage.jsx';
import ClientProfilePage from '../pages/ClientProfilePage.jsx';
import { RequireUserAuth } from '@booking/shared/middleware/auth-role.js';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClientAuthLanding />} />
      <Route path="/maps" element={<ClientMapsPage />} />
      <Route
        path="/book"
        element={
          <RequireUserAuth>
            <ClientBookCourtPage />
          </RequireUserAuth>
        }
      />
      {/* Lịch sử đặt sân của user */}
      <Route
        path="/history"
        element={
          <RequireUserAuth>
            <ClientHistoryPage />
          </RequireUserAuth>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
                path="/profile"
                element={
                    <RequireUserAuth>
                        <ClientProfilePage />
                    </RequireUserAuth>
                }
            />
    </Routes>
  );
}
