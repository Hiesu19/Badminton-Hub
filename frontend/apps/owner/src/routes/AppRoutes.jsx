import { Routes, Route } from 'react-router-dom';
import { ProfilePage, LoginPage, ForgotPasswordPage } from '@booking/shared';
import OwnerAuthLanding from '../pages/OwnerAuthLanding.jsx';
import SubCourtsPage from '../pages/SubCourtsPage.jsx';
import OwnerCourtsPage from '../pages/OwnerCourtsPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing + Auth cho owner */}
      <Route path="/" element={<OwnerAuthLanding />} />
      {/* Trang quản lý sân */}
      <Route path="/courts" element={<OwnerCourtsPage />} />
      {/* Trang quản lý sân con */}
      <Route path="/sub-courts" element={<SubCourtsPage />} />
      {/* Trang đăng nhập dùng chung (client/owner/admin) */}
      <Route path="/login" element={<LoginPage />} />
      {/* Trang quên mật khẩu (OTP + đổi mật khẩu) */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Trang thông tin cá nhân dùng chung */}
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
