import { useEffect, useState } from 'react';
import { SidebarPage } from '@booking/shared';
import { sidebarItemsAdmin } from '@booking/shared/const/sidebarItems.js';
import ProfilePage from '@booking/shared/pages/ProfilePage.jsx';
import { logout } from '@booking/shared/services/authService.js';
import { useNavigate } from 'react-router-dom';

export default function AdminProfilePage() {
  const [sidebarUser, setSidebarUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      setSidebarUser({
        name:
          parsed?.fullName || parsed?.name || parsed?.email || 'Người quản trị',
        role: parsed?.role || 'super_admin',
        avatarUrl: parsed?.avatarUrl,
      });
    } catch {
      setSidebarUser(null);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
  };

  return (
    <SidebarPage items={sidebarItemsAdmin} user={sidebarUser} canOpenProfile>
      <ProfilePage title="Thông tin quản trị viên" />
    </SidebarPage>
  );
}
