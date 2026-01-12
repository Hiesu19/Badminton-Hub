import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { SidebarPage, showErrorToast } from '@booking/shared';
import { sidebarItemsAdmin } from '@booking/shared/const/sidebarItems.js';
import {
  fetchAdminCourtStats,
  fetchAdminRevenueStats,
  fetchAdminUserStats,
} from '../services/adminDashboardService.js';
import { logout } from '@booking/shared/services/authService.js';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (value) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value)
    : '—';

const StatCard = ({ label, value, detail }) => (
  <Paper
    elevation={2}
    sx={{
      flex: { xs: '1 1 100%', md: '1 1 30%' },
      minWidth: 200,
      px: 3,
      py: 2.5,
      borderRadius: 3,
      position: 'relative',
    }}
  >
    <Typography
      variant="caption"
      sx={{ textTransform: 'uppercase', letterSpacing: 1.2 }}
    >
      {label}
    </Typography>
    <Typography
      variant="h4"
      sx={{ fontWeight: 800, mt: 0.5, color: '#0f172a' }}
    >
      {value}
    </Typography>
    <Typography variant="body2" sx={{ color: '#475467', mt: 0.5 }}>
      {detail}
    </Typography>
    <Chip
      label="Cập nhật mới"
      size="small"
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        bgcolor: '#ecfccb',
        color: '#365314',
        fontWeight: 600,
      }}
    />
  </Paper>
);

const StatsGrid = ({ stats }) => (
  <Stack
    direction={{ xs: 'column', md: 'row' }}
    spacing={2}
    sx={{ flexWrap: 'wrap' }}
  >
    {stats.map((item) => (
      <StatCard key={item.label} {...item} />
    ))}
  </Stack>
);

const AlertsPanel = ({ alerts }) => (
  <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={3}
      alignItems="center"
      justifyContent="space-between"
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Hoạt động nổi bật
        </Typography>
        <Typography variant="body2" sx={{ color: '#475467', mt: 0.5 }}>
          Những thông tin quan trọng giúp bạn nắm bắt tổng quan hệ thống trong
          nháy mắt.
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="success"
        sx={{ textTransform: 'none', fontWeight: 600 }}
      >
        Tạo báo cáo nhanh
      </Button>
    </Stack>
    <Divider sx={{ my: 2 }} />
    <Stack spacing={1.5}>
      {alerts.map((text) => (
        <Box
          key={text}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: '#f8fafc',
            px: 2,
            py: 1.25,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: '#16a34a',
              borderRadius: '50%',
            }}
          />
          <Typography variant="body2" sx={{ color: '#334155' }}>
            {text}
          </Typography>
        </Box>
      ))}
    </Stack>
  </Paper>
);

const RevenuePanel = ({ revenueStats, loading }) => (
  <Paper
    elevation={0}
    sx={{ bgcolor: '#f1f5f9', p: 3, borderRadius: 2, mt: 2 }}
  >
    <Typography variant="subtitle2" sx={{ color: '#475467', mb: 1 }}>
      Doanh thu theo kỳ
    </Typography>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      {['today', 'week', 'month'].map((period) => (
        <Box key={period}>
          <Typography
            variant="caption"
            sx={{ textTransform: 'uppercase', letterSpacing: 1.2 }}
          >
            {period === 'today'
              ? 'Trong ngày'
              : period === 'week'
              ? 'Trong tuần'
              : 'Trong tháng'}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
            {loading ? '...' : formatCurrency(revenueStats?.[period])}
          </Typography>
        </Box>
      ))}
    </Stack>
  </Paper>
);

export default function AdminHomePage() {
  const [courtStats, setCourtStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarUser, setSidebarUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSidebarUser({
            name:
              parsed?.fullName ||
              parsed?.name ||
              parsed?.email ||
              'Người quản trị',
            role: parsed?.role || 'super_admin',
            avatarUrl: parsed?.avatarUrl,
          });
        }
      } catch {
        setSidebarUser(null);
      }
    }

    const loadStats = async () => {
      setLoading(true);
      try {
        const [courtsRes, usersRes, revenueRes] = await Promise.all([
          fetchAdminCourtStats(),
          fetchAdminUserStats(),
          fetchAdminRevenueStats(),
        ]);
        setCourtStats(courtsRes.data?.data ?? null);
        setUserStats(usersRes.data?.data ?? null);
        setRevenueStats(revenueRes.data?.data ?? null);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          'Không thể tải dữ liệu dashboard. Vui lòng thử lại.';
        showErrorToast(msg);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: 'Tổng số sân',
        value: loading ? '...' : courtStats?.totalCourts ?? '—',
        detail: `Đang chờ duyệt ${courtStats?.pendingCourts ?? '—'}`,
      },
      {
        label: 'Tài khoản USER',
        value: loading ? '...' : userStats?.totalUsers ?? '—',
        detail: 'Vai trò user đang hoạt động',
      },
      {
        label: 'Doanh thu tháng',
        value: loading ? '...' : formatCurrency(revenueStats?.month),
        detail: 'So sánh mục tiêu vận hành',
      },
    ],
    [courtStats, revenueStats, userStats, loading],
  );

  const alerts = useMemo(
    () => [
      `Có ${
        courtStats?.pendingCourts ?? '—'
      } đề xuất sân mới đang chờ xác nhận.`,
      `Tổng ${
        userStats?.totalUsers ?? '—'
      } tài khoản role USER đang hoạt động.`,
      revenueStats
        ? `Doanh thu tuần này: ${formatCurrency(
            revenueStats.week,
          )} - cao hơn tuần trước.`
        : 'Cập nhật doanh thu hàng tuần đang chờ dữ liệu.',
    ],
    [courtStats, userStats, revenueStats],
  );

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
  };

  return (
    <SidebarPage items={sidebarItemsAdmin} user={sidebarUser} canOpenProfile>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Bảng điều khiển quản trị
          </Typography>
          <Typography variant="body2" sx={{ color: '#4b5563' }}>
            Theo dõi trạng thái hệ thống, xử lý yêu cầu chủ sân và cập nhật
            nhanh các sự kiện liên quan đến đội ngũ vận hành.
          </Typography>
        </Box>

        <StatsGrid stats={stats} />
        <AlertsPanel alerts={alerts} />
        <RevenuePanel revenueStats={revenueStats} loading={loading} />
      </Stack>
    </SidebarPage>
  );
}
