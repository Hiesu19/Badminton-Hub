import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
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
  fetchAdminRevenueTrend,
} from '../services/adminDashboardService.js';
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

const RevenueTrendChart = ({ data, loading }) => {
  const width = 640;
  const height = 200;
  const padding = 32;
  const maxRevenue =
    data.length > 0 ? Math.max(...data.map((item) => item.revenue ?? 0), 1) : 1;

  const dx =
    data.length > 1
      ? (width - padding * 2) / (data.length - 1)
      : width - padding * 2;

  const points = data.map((item, index) => {
    const val = item.revenue ?? 0;
    const x = padding + dx * index;
    const ratio = Math.min(val / maxRevenue, 1);
    const y = height - padding - ratio * (height - padding * 2);
    return { x, y, label: item.date, value: val };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
  const areaPath =
    points.length > 0
      ? `M ${points[0].x} ${height - padding} ${points
          .map((point) => `L ${point.x} ${point.y}`)
          .join(' ')} L ${points[points.length - 1].x} ${height - padding} Z`
      : '';

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid #e5f0e6',
        p: 2.5,
        mt: 2,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Doanh thu theo ngày
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            overflowX: 'auto',
          }}
        >
          <svg width={width} height={height}>
            <defs>
              <linearGradient id="trendGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <rect
              x={padding}
              y={padding}
              width={width - padding * 2}
              height={height - padding * 2}
              fill="#f9fbff"
            />
            <path d={areaPath} fill="url(#trendGrad)" stroke="none" />
            <path d={linePath} fill="none" stroke="#22c55e" strokeWidth={2} />
            {points.map((point) => (
              <g key={point.label}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill="#fff"
                  stroke="#256231"
                  strokeWidth={2}
                />
                <text
                  x={point.x}
                  y={height - padding + 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#475467"
                >
                  {new Date(point.label).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </text>
              </g>
            ))}
          </svg>
        </Box>
      )}
    </Paper>
  );
};

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
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [sidebarUser, setSidebarUser] = useState(null);

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
    loadRevenueTrend();
  }, []);

  const loadRevenueTrend = async () => {
    setTrendLoading(true);
    try {
      const res = await fetchAdminRevenueTrend();
      setRevenueTrend(res.data?.data?.items ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setTrendLoading(false);
    }
  };

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
        <RevenuePanel revenueStats={revenueStats} loading={loading} />
        <RevenueTrendChart data={revenueTrend} loading={trendLoading} />
      </Stack>
    </SidebarPage>
  );
}
