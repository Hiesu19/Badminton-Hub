import { useEffect, useState } from 'react';
import { Box, Button, Typography, Chip, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import {
  MainLayout,
  Sidebar,
  AuthLoginForm,
  AuthRegisterForm,
} from '@booking/shared';
import '../App.css';

/**
 * Trang landing/auth cho client:
 * - Bên trái: giới thiệu ngắn về hệ thống
 * - Bên phải: form đăng nhập/đăng ký hoặc chào mừng + nút đăng xuất nếu đã đăng nhập
 */
export default function ClientAuthLanding() {
  const [mode, setMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    syncUserFromStorage();
  }, []);

  const syncUserFromStorage = () => {
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
  };

  /**
   * Callback truyền cho form đăng nhập, dùng để đồng bộ lại state sau khi login ok.
   */
  const handleLoginSuccess = () => {
    syncUserFromStorage();
  };

  /**
   * Xoá token + thông tin user khỏi localStorage và reset state.
   */
  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setMode('login');
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

  return (
    <MainLayout sidebar={sidebar}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 4, md: 6 },
          py: { xs: 2, md: 4 },
        }}
      >
        {/* Khối giới thiệu bên trái */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Chip
            label="Nền tảng đặt sân cầu lông cho cộng đồng"
            sx={{
              alignSelf: 'flex-start',
              bgcolor: '#dcfce7',
              color: '#166534',
              fontWeight: 600,
            }}
          />

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: '#052e16',
                fontSize: { xs: 30, md: 36 },
                lineHeight: 1.2,
                mb: 1.5,
              }}
            >
              Badminton Hub – Đặt sân dễ dàng,
              <br />
              chơi hết mình cùng bạn bè.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#4b5563',
                maxWidth: 480,
              }}
            >
              Tìm kiếm sân phù hợp, giữ chỗ nhanh chóng và quản lý lịch chơi của
              bạn trong một nền tảng duy nhất. Tập trung vào trận đấu, còn lại
              để Badminton Hub lo.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
            <Chip
              label="Đặt sân theo giờ linh hoạt"
              sx={{ bgcolor: '#ecfdf3', color: '#15803d' }}
            />
            <Chip
              label="Theo dõi lịch sử & thanh toán"
              sx={{ bgcolor: '#eff6ff', color: '#1d4ed8' }}
            />
            <Chip
              label="Kết nối chủ sân & người chơi"
              sx={{ bgcolor: '#fef3c7', color: '#92400e' }}
            />
          </Stack>
        </Box>

        {/* Khối Auth / Thông tin user bên phải */}
        <Box
          sx={{
            flex: 1,
            maxWidth: 520,
            mx: 'auto',
            width: '100%',
          }}
        >
          {currentUser ? (
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: '#ffffff',
                boxShadow: '0 12px 40px rgba(15, 46, 36, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: '#1f3f2b', mb: 1 }}
                >
                  Xin chào, {sidebarUser.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#4b5563', mb: 1.5 }}>
                  Bạn đã đăng nhập với vai trò{' '}
                  <strong>{sidebarUser.role}</strong>.
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Bạn có thể tiếp tục sử dụng hệ thống hoặc đăng xuất khi cần.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: '#22c55e',
                    color: '#166534',
                    '&:hover': {
                      borderColor: '#16a34a',
                      bgcolor: '#ecfdf3',
                    },
                  }}
                >
                  Đăng xuất
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 2.5,
                }}
              >
                <Button
                  variant={mode === 'login' ? 'contained' : 'text'}
                  onClick={() => setMode('login')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: mode === 'login' ? '#22c55e' : 'transparent',
                    color: mode === 'login' ? '#ffffff' : '#374151',
                    '&:hover': {
                      bgcolor: mode === 'login' ? '#16a34a' : '#f3f4f6',
                    },
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant={mode === 'register' ? 'contained' : 'text'}
                  onClick={() => setMode('register')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: mode === 'register' ? '#22c55e' : 'transparent',
                    color: mode === 'register' ? '#ffffff' : '#374151',
                    '&:hover': {
                      bgcolor: mode === 'register' ? '#16a34a' : '#f3f4f6',
                    },
                  }}
                >
                  Đăng ký
                </Button>
              </Box>

              {mode === 'login' ? (
                <AuthLoginForm
                  site="client"
                  title="Đăng nhập Badminton Hub"
                  onSuccess={handleLoginSuccess}
                />
              ) : (
                <AuthRegisterForm title="Tạo tài khoản Badminton Hub" />
              )}
            </>
          )}
        </Box>
      </Box>
    </MainLayout>
  );
}
