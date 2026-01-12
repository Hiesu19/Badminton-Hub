import { Routes, Route } from 'react-router-dom';
import { LoginPage, ForgotPasswordPage } from '@booking/shared';
import OwnerAuthLanding from '../pages/OwnerAuthLanding.jsx';
import SubCourtsPage from '../pages/SubCourtsPage.jsx';
import OwnerCourtsPage from '../pages/OwnerCourtsPage.jsx';
import OwnerBookingsPage from '../pages/OwnerBookingsPage.jsx';
import OwnerDashboardPage from '../pages/OwnerDashboardPage.jsx';
import OwnerLockCourtPage from '../pages/OwnerLockCourtPage.jsx';
import OwnerGalleryPage from '../pages/OwnerGalleryPage.jsx';
import { RequireOwnerAuth } from '@booking/shared/middleware/auth-role.js';
import OwnerProfilePage from '../pages/OwnerProfilePage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing + Auth cho owner */}
      <Route path="/" element={<OwnerAuthLanding />} />
      {/* Dashboard owner */}
      <Route
        path="/dashboard"
        element={
          <RequireOwnerAuth>
            <OwnerDashboardPage />
          </RequireOwnerAuth>
        }
      />
      {/* Trang quản lý sân */}
      <Route
        path="/courts"
        element={
          <RequireOwnerAuth>
            <OwnerCourtsPage />
          </RequireOwnerAuth>
        }
      />
      {/* Trang quản lý sân con */}
      <Route
        path="/sub-courts"
        element={
          <RequireOwnerAuth>
            <SubCourtsPage />
          </RequireOwnerAuth>
        }
      />
      {/* Trang quản lý đặt sân */}
      <Route
        path="/bookings"
        element={
          <RequireOwnerAuth>
            <OwnerBookingsPage />
          </RequireOwnerAuth>
        }
      />
      {/* Trang khoá sân ngoài hệ thống */}
      <Route
        path="/lock-court"
        element={
          <RequireOwnerAuth>
            <OwnerLockCourtPage />
          </RequireOwnerAuth>
        }
      />
      <Route
        path="/gallery"
        element={
          <RequireOwnerAuth>
            <OwnerGalleryPage />
          </RequireOwnerAuth>
        }
      />
      {/* Trang đăng nhập dùng chung (client/owner/admin) */}
      <Route path="/login" element={<LoginPage defaultSite="owner" />} />
      {/* Trang quên mật khẩu (OTP + đổi mật khẩu) */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Trang thông tin cá nhân dùng chung */}
      <Route
        path="/profile"
        element={
          <RequireOwnerAuth>
            <OwnerProfilePage />
          </RequireOwnerAuth>
        }
      />
    </Routes>
  );
}
