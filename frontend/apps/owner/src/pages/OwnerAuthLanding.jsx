import { useEffect, useState } from 'react';
import { Box, Button, Typography, Chip, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import { MainLayout, Sidebar } from '@booking/shared';
import { useNavigate } from 'react-router-dom';
import '../App.css';

/**
 * Trang landing/auth cho owner:
 * - Bên trái: giới thiệu ngắn về hệ thống
 * - Bên phải: form đăng nhập hoặc chào mừng + nút đăng xuất nếu đã đăng nhập
 */
export default function OwnerAuthLanding() {
  const navigate = useNavigate();
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
        setCurrentUser({ role: 'owner' });
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
  };

  const sidebarItems = [
    { text: 'Trang chủ', icon: HomeIcon, path: '/' },
    { text: 'Quản lý sân', icon: BusinessIcon, path: '/courts' },
    { text: 'Quản lý các sân con', icon: DashboardIcon, path: '/sub-courts' },
    { text: 'Quản lý đặt sân', icon: DashboardIcon, path: '/bookings' },
  ];

  const sidebarUser = currentUser
    ? {
        name:
          currentUser.fullName ||
          currentUser.name ||
          currentUser.email ||
          'Chủ sân',
        role: currentUser.role || 'owner',
        avatarUrl: currentUser.avatarUrl,
      }
    : {
        name: 'Chủ sân',
        role: 'owner',
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
            label="Nền tảng quản lý sân cầu lông cho chủ sân"
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
              Badminton Hub – Quản lý sân dễ dàng,
              <br />
              phục vụ khách hàng tốt hơn.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#4b5563',
                maxWidth: 480,
              }}
            >
              Quản lý sân, theo dõi đặt chỗ, xử lý thanh toán và tối ưu hóa hoạt
              động kinh doanh của bạn trong một nền tảng duy nhất. Tập trung vào
              phục vụ khách hàng, còn lại để Badminton Hub lo.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
            <Chip
              label="Quản lý sân và giá cả"
              sx={{ bgcolor: '#ecfdf3', color: '#15803d' }}
            />
            <Chip
              label="Theo dõi đặt chỗ & doanh thu"
              sx={{ bgcolor: '#eff6ff', color: '#1d4ed8' }}
            />
            <Chip
              label="Phân tích và báo cáo"
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
                  Bạn có thể tiếp tục quản lý sân của mình hoặc đăng xuất khi
                  cần.
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
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: '#ffffff',
                boxShadow: '0 12px 40px rgba(15, 46, 36, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: '#1f3f2b', mb: 0.5 }}
              >
                Bắt đầu với Badminton Hub
              </Typography>
              <Typography variant="body2" sx={{ color: '#4b5563' }}>
                Đăng nhập để quản lý sân, theo dõi đặt chỗ và xem báo cáo doanh
                thu của bạn.
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ mt: 1 }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() =>
                    navigate('/login', { state: { site: 'owner' } })
                  }
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: '#22c55e',
                    '&:hover': {
                      bgcolor: '#16a34a',
                    },
                  }}
                >
                  Đăng nhập
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </MainLayout>
  );
}
