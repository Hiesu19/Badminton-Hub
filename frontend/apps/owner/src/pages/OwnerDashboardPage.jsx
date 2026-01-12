import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { SidebarPage } from '@booking/shared';
import { sidebarItemsOwner } from '@booking/shared/const/sidebarItems.js';
import { fetchOwnerDashboard, fetchOwnerCoverage } from '../services/ownerDashboardService.js';
import DashboardStatTabs from '../components/DashboardStatTabs.jsx';

const formatCurrency = (value) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value)
    : '—';

const StatCard = ({ label, value, detail }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 3,
      p: 2.5,
      border: '1px solid #e5f0e6',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    }}
  >
    <Typography variant="subtitle2" sx={{ color: '#475467' }}>
      {label}
    </Typography>
    <Typography variant="h5" sx={{ fontWeight: 700 }}>
      {value ?? '—'}
    </Typography>
    {detail && (
      <Typography variant="body2" sx={{ color: '#475467' }}>
        {detail}
      </Typography>
    )}
  </Paper>
);

const STATUS_META = {
  pending: { label: 'Chờ duyệt', color: 'warning' },
  confirmed: { label: 'Đã xác nhận', color: 'success' },
  rejected: { label: 'Từ chối', color: 'error' },
  cancelled: { label: 'Đã hủy', color: 'default' },
  locked: { label: 'Bị khoá', color: 'default' },
};

export default function OwnerDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [coverageData, setCoverageData] = useState([]);

  useEffect(() => {
    syncUserFromStorage();
    loadStats();
    loadCoverage();
  }, []);

  const syncUserFromStorage = () => {
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        setCurrentUser(JSON.parse(rawUser));
      }
    } catch {
      setCurrentUser(null);
    }
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetchOwnerDashboard();
      setStats(res.data?.data ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCoverage = async () => {
    const today = new Date();
    const dates = Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date(today);
      date.setDate(today.getDate() - idx);
      return date;
    });

    try {
      const responses = await Promise.all(
        dates.map((date) =>
          fetchOwnerCoverage(date.toISOString().slice(0, 10)),
        ),
      );
      const items = responses
        .map((res, idx) => ({
          ...(res.data?.data ?? res.data ?? res),
          rawDate: dates[idx],
        }))
        .filter((item) => item && item.date);
      setCoverageData(items.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const formatCoverageLabel = (rawDate, dateString) => {
    const date = new Date(rawDate || dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
  };

  const statTabs = useMemo(
    () => [
      {
        label: 'Trong ngày',
        cards: [
          {
            label: 'Đặt sân',
            value: stats?.dailyBookingCount ?? '—',
            detail: 'Booking được tạo trong ngày',
          },
          {
            label: 'Doanh thu',
            value: formatCurrency(stats?.dailyRevenue),
            detail: 'Tính theo ngày',
          },
        ],
      },
      {
        label: 'Trong tuần',
        cards: [
          {
            label: 'Đặt sân',
            value: stats?.weeklyBookingCount ?? '—',
            detail: 'Booking tuần này',
          },
          {
            label: 'Doanh thu',
            value: formatCurrency(stats?.weeklyRevenue),
            detail: 'Tính từ đầu tuần',
          },
        ],
      },
      {
        label: 'Trong tháng',
        cards: [
          {
            label: 'Đặt sân',
            value: stats?.monthlyBookingCount ?? '—',
            detail: 'Booking trong tháng',
          },
          {
            label: 'Doanh thu',
            value: formatCurrency(stats?.monthlyRevenue),
            detail: 'Luỹ kế tháng này',
          },
        ],
      },
    ],
    [stats],
  );

  const overviewCards = useMemo(
    () => [
      {
        label: 'Tổng booking',
        value: stats?.totalBookings ?? '—',
      },
      {
        label: 'Tổng doanh thu',
        value: formatCurrency(stats?.totalRevenue),
      },
      {
        label: 'Khách hàng',
        value: stats?.uniqueCustomers ?? '—',
      },
      {
        label: 'Số sân đã đặt',
        value: stats?.bookedCourtCount ?? '—',
      },
    ],
    [stats],
  );

  const statusEntries = useMemo(
    () => Object.entries(stats?.statusCounts ?? {}),
    [stats],
  );

  const coverageReady = coverageData.length > 0;

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

  return (
    <SidebarPage
      user={sidebarUser}
      items={sidebarItemsOwner}
      canOpenProfile={!!currentUser}
      appBarTitle="Tổng quan"
    >
      <Box
        sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 0 } }}
      >
        <Stack spacing={3} sx={{ width: '100%' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Dashboard owner
            </Typography>
            <Typography variant="body2" sx={{ color: '#475467' }}>
              Theo dõi booking, doanh thu và trạng thái đặt sân trong thời gian
              thực.
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <DashboardStatTabs tabs={statTabs} />

              <Grid container spacing={2}>
                {overviewCards.map((card) => (
                  <Grid item xs={12} sm={6} md={3} key={card.label}>
                    <StatCard {...card} />
                  </Grid>
                ))}
              </Grid>

            {coverageReady && (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid #e5f0e6',
                  p: 2.5,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: '#1f3f2b' }}
                >
                  Độ phủ giờ đặt trong tuần
                </Typography>
                <Stack spacing={1}>
                  {coverageData.map((item) => {
                    const percent = Math.min(
                      Math.round((item.percentage ?? 0) * 100),
                      100,
                    );
                    return (
                      <Box key={item.date} sx={{ width: '100%' }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 0.5 }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: '#475467', fontWeight: 600 }}
                          >
                            {formatCoverageLabel(item.rawDate, item.date)}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: '#475467', fontWeight: 600 }}
                          >
                            {`${percent}%`}
                          </Typography>
                        </Stack>
                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 999,
                            bgcolor: '#e5e7eb',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${percent}%`,
                              height: '100%',
                              bgcolor: '#22c55e',
                              transition: 'width 200ms ease',
                            }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{ color: '#6b7280', display: 'block', mt: 0.5 }}
                        >
                          {`Đã đặt ${item.bookedHours ?? 0} / ${item.availableHours ?? 0} giờ`}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </Paper>
            )}

              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: 2.5,
                  border: '1px solid #e5f0e6',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 1, color: '#1f3f2b' }}
                >
                  Trạng thái booking
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {statusEntries.map(([key, value]) => {
                    const meta = STATUS_META[key] || {
                      label: key,
                      color: 'default',
                    };
                    return (
                      <Chip
                        key={key}
                        label={`${meta.label}: ${value ?? 0}`}
                        color={meta.color}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    );
                  })}
                </Stack>
              </Paper>
            </>
          )}
        </Stack>
      </Box>
    </SidebarPage>
  );
}
