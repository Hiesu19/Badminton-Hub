import React, { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import { MainLayout, Sidebar } from '@booking/shared';
import { logout } from '@booking/shared/services/authService.js';
import { useNavigate } from 'react-router-dom';

export default function ClientSidebarLayout({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const rawUser = localStorage.getItem('user');

      if (!accessToken && !rawUser) {
        setCurrentUser(null);
        return;
      }

      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        setCurrentUser(parsed);
      } else {
        setCurrentUser({ role: 'client' });
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setCurrentUser(null);
      navigate('/login');
    }
  };

  const sidebarItems = [
    { text: 'Trang chủ', icon: HomeIcon, path: '/' },
    { text: 'Map View', icon: DashboardIcon, path: '/maps' },
    { text: 'Đặt sân', icon: DashboardIcon, path: '/book' },
    {
      text: 'Lịch sử đặt sân',
      icon: RequestPageIcon,
      path: '/history',
    },
  ];

  const sidebarUser = currentUser
    ? {
        name:
          currentUser.fullName ||
          currentUser.name ||
          currentUser.email ||
          'Người dùng',
        role: currentUser.role || 'client',
        avatarUrl: currentUser.avatarUrl,
      }
    : {
        name: 'Khách chơi',
        role: 'client',
      };

  const sidebar = (
    <Sidebar
      user={sidebarUser}
      items={sidebarItems}
      canOpenProfile={!!currentUser}
      onLogout={currentUser ? handleLogout : undefined}
    />
  );

  return <MainLayout sidebar={sidebar}>{children}</MainLayout>;
}
