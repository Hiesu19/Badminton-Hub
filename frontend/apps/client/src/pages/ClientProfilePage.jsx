import { useEffect, useState } from 'react';
import { SidebarPage } from '@booking/shared';
import { sidebarItemsClient } from '@booking/shared/const/sidebarItems.js';
import ProfilePage from '@booking/shared/pages/ProfilePage.jsx';

export default function ClientProfilePage() {
  const [sidebarUser, setSidebarUser] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      setSidebarUser({
        name: parsed?.fullName || parsed?.name || parsed?.email || 'Người chơi',
        role: parsed?.role || 'user',
        avatarUrl: parsed?.avatarUrl,
      });
    } catch {
      setSidebarUser(null);
    }
  }, []);

  return (
    <SidebarPage items={sidebarItemsClient} user={sidebarUser} canOpenProfile>
      <ProfilePage title="Hồ sơ người chơi" />
    </SidebarPage>
  );
}

