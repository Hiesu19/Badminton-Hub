import { useEffect, useState } from 'react';
import { SidebarPage } from '@booking/shared';
import { sidebarItemsOwner } from '@booking/shared/const/sidebarItems.js';
import ProfilePage from '@booking/shared/pages/ProfilePage.jsx';

export default function OwnerProfilePage() {
  const [sidebarUser, setSidebarUser] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      setSidebarUser({
        name:
          parsed?.fullName ||
          parsed?.name ||
          parsed?.email ||
          'Chủ sân',
        role: parsed?.role || 'owner',
        avatarUrl: parsed?.avatarUrl,
      });
    } catch {
      setSidebarUser(null);
    }
  }, []);

  return (
    <SidebarPage items={sidebarItemsOwner} user={sidebarUser} canOpenProfile>
      <ProfilePage title="Hồ sơ chủ sân" />
    </SidebarPage>
  );
}

