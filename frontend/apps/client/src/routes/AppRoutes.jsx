import { Routes, Route } from 'react-router-dom';
import { ProfilePage } from '@booking/shared';
import ClientAuthLanding from '../pages/ClientAuthLanding.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing + Auth cho client */}
      <Route path="/" element={<ClientAuthLanding />} />
      {/* Trang thông tin cá nhân dùng chung */}
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
