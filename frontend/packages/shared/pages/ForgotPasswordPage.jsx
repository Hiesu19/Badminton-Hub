import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Sidebar from '../layouts/Sidebar.jsx';
import AuthForgotPasswordForm from '../auth/AuthForgotPasswordForm.jsx';

export default function ForgotPasswordPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const site = searchParams.get('site') || 'client';

  useEffect(() => {
    document.title = 'Quên mật khẩu - Badminton Hub';
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
              Khôi phục mật khẩu
            </Typography>
            <Typography variant="body1" sx={{ color: '#4b5563', mb: 2 }}>
              Nhập email để nhận mã OTP, sau đó đặt lại mật khẩu mới cho tài
              khoản của bạn.
            </Typography>
          </Box>

          <Box>
            <AuthForgotPasswordForm site={site} />
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
