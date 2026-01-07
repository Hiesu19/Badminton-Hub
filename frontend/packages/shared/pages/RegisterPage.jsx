import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import MainLayout from '../layouts/MainLayout.jsx';
import Sidebar from '../layouts/Sidebar.jsx';
import AuthRegisterForm from '../auth/AuthRegisterForm.jsx';

export default function RegisterPage() {
  useEffect(() => {
    document.title = 'Đăng ký - Badminton Hub';
  }, []);

  const sidebar = (
    <Sidebar
      user={null}
      items={[
        { text: 'Trang chủ', path: '/' },
        { text: 'Map View', path: '/maps' },
        { text: 'Đặt sân', path: '/book' },
      ]}
      canOpenProfile={false}
    />
  );

  return (
    <MainLayout sidebar={sidebar}>
      <Box
        sx={{
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 960,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            gap: 4,
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: '#052e16', mb: 2 }}
            >
              Tạo tài khoản người chơi
            </Typography>
            <Typography variant="body1" sx={{ color: '#4b5563', mb: 2 }}>
              Đăng ký tài khoản để có thể đặt sân, theo dõi lịch chơi và nhận ưu
              đãi từ các cụm sân trên Badminton Hub.
            </Typography>
          </Box>

          <Box>
            <AuthRegisterForm />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
