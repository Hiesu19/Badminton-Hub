import React, { useEffect } from 'react';
import { Box, Typography, Link as MuiLink, Button, Stack } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import Sidebar from '../layouts/Sidebar.jsx';
import AuthLoginForm from '../auth/AuthLoginForm.jsx';

export default function LoginPage({ defaultSite = null }) {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const siteFromState = location.state?.site;
  const site =
    siteFromState || searchParams.get('site') || defaultSite || 'client';

  useEffect(() => {
    document.title = 'Đăng nhập - Badminton Hub';
  }, []);

  const handleSuccess = ({ accessToken, refreshToken }) => {
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } catch {}

    if (site === 'owner') {
      navigate('/', { replace: true });
    } else if (site === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const sidebarItems =
    site === 'owner'
      ? [
          { text: 'Trang chủ', path: '/' },
          { text: 'Quản lý sân', path: '/courts' },
          { text: 'Quản lý đặt sân', path: '/bookings' },
        ]
      : site === 'admin'
      ? [
          { text: 'Trang chủ', path: '/' },
          { text: 'Quản lý hệ thống', path: '/admin' },
        ]
      : [
          { text: 'Trang chủ', path: '/' },
          { text: 'Map View', path: '/maps' },
          { text: 'Đặt sân', path: '/book' },
        ];

  const sidebar = (
    <Sidebar user={null} items={sidebarItems} canOpenProfile={false} />
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
              Đăng nhập để đặt sân nhanh chóng
            </Typography>
            <Typography variant="body1" sx={{ color: '#4b5563', mb: 2 }}>
              Badminton Hub giúp bạn tìm và đặt sân cầu lông chỉ trong vài cú
              click. Theo dõi lịch đặt, quản lý hoá đơn và kết nối với các cụm
              sân uy tín.
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Bạn chưa có tài khoản? Liên hệ chủ sân hoặc quản trị viên để được
              cấp tài khoản phù hợp.
            </Typography>
          </Box>

          <Box>
            <AuthLoginForm
              site={site}
              onSuccess={handleSuccess}
              title={
                site === 'owner'
                  ? 'Đăng nhập chủ sân'
                  : site === 'admin'
                  ? 'Đăng nhập quản trị'
                  : 'Đăng nhập người chơi'
              }
            />
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <MuiLink
                component={RouterLink}
                to={`/forgot-password?site=${site}`}
                sx={{ fontSize: 13, display: 'inline-block', mb: 1.5 }}
              >
                Quên mật khẩu?
              </MuiLink>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                sx={{ mt: 1 }}
              >
                {site === 'client' && (
                  <Button
                    component={RouterLink}
                    to="/register"
                    size="small"
                    variant="outlined"
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 999,
                      textTransform: 'none',
                      borderColor: '#22c55e',
                      color: '#166534',
                      '&:hover': {
                        borderColor: '#16a34a',
                        bgcolor: '#ecfdf3',
                      },
                    }}
                  >
                    Đăng ký người chơi
                  </Button>
                )}
                {site === 'owner' && (
                  <Button
                    component="a"
                    href="mailto:thaihieu1919@gmail.com"
                    size="small"
                    variant="outlined"
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 999,
                      textTransform: 'none',
                      borderColor: '#1d4ed8',
                      color: '#1d4ed8',
                      '&:hover': {
                        borderColor: '#1e40af',
                        bgcolor: '#eff6ff',
                      },
                    }}
                  >
                    Đăng ký chủ sân
                  </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
