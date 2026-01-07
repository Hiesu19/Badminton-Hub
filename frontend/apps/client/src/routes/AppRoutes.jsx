import { Routes, Route } from 'react-router-dom';
import {
  ProfilePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
} from '@booking/shared';
import ClientAuthLanding from '../pages/ClientAuthLanding.jsx';
import ClientMapsPage from '../pages/ClientMapsPage.jsx';
import ClientBookCourtPage from '../pages/ClientBookCourtPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing + Auth cho client */}
      <Route path="/" element={<ClientAuthLanding />} />
      {/* Trang bản đồ các sân */}
      <Route path="/maps" element={<ClientMapsPage />} />
      {/* Trang đặt sân riêng cho từng sân (?courtId=...) */}
      <Route path="/book" element={<ClientBookCourtPage />} />
      {/* Trang đăng nhập dùng chung (client/owner/admin) */}
      <Route path="/login" element={<LoginPage />} />
      {/* Trang đăng ký người chơi */}
      <Route path="/register" element={<RegisterPage />} />
      {/* Trang quên mật khẩu (OTP + đổi mật khẩu) */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Trang thông tin cá nhân dùng chung */}
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
