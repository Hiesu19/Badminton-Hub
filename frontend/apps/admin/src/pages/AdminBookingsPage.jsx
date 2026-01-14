import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
} from '@mui/material';
import { CalendarToday, Search } from '@mui/icons-material';
import { SidebarPage, showErrorToast } from '@booking/shared';
import { sidebarItemsAdmin } from '@booking/shared/const/sidebarItems.js';
import { fetchAdminBookings } from '../services/adminBookingService.js';

const STATUS_LABELS = {
  pending: 'Chờ bill',
  confirmed: 'Đã xác nhận',
  rejected: 'Từ chối',
  cancelled: 'Đã huỷ',
  out_of_system: 'Ngoài hệ thống',
  locked: 'Đã khoá',
};

const STATUS_COLORS = {
  pending: 'warning',
  confirmed: 'success',
  rejected: 'error',
  cancelled: 'default',
  out_of_system: 'info',
  locked: 'error',
};

const formatCurrency = (value) =>
  typeof value === 'number'
    ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value)
    : '—';

const formatTimeLabel = (time) => (time ? time.slice(0, 5) : '—');

const limitPerPage = 20;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateFilter, setDateFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarUser, setSidebarUser] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
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
  }, []);

  useEffect(() => {
    if (page < 1) {
      setPage(1);
      return;
    }
    loadBookings();
  }, [page, dateFilter, searchTerm]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminBookings({
        page,
        limit: limitPerPage,
        date: dateFilter || undefined,
        search: searchTerm || undefined,
      });
      const payload = res.data?.data ?? [];
      setBookings(payload);
      const metadata =
        res.data?.metadata?.meta ??
        res.data?.meta ??
        res.data?.metadata ??
        null;
      setTotal(metadata?.total ?? payload.length);
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message ||
          'Không thể tải danh sách booking. Vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  const handleDateChange = (value) => {
    setPage(1);
    setDateFilter(value);
  };

  const rows = useMemo(
    () =>
      bookings.map((booking) => ({
        id: booking.id,
        userName:
          booking.user?.name ??
          booking.user?.email ??
          booking.user?.phone ??
          '—',
        userEmail: booking.user?.email ?? '—',
        supperCourt: booking.supperCourt?.name ?? '—',
        date: booking.items?.[0]?.date ?? '—',
        status: booking.status ?? '—',
        totalPrice: booking.totalPrice ?? 0,
        billUrl: booking.imgBill,
        items: booking.items ?? [],
      })),
    [bookings],
  );

  const totalPages = Math.max(1, Math.ceil(total / limitPerPage));

  const renderItemLines = (items) => {
    if (!items.length) {
      return (
        <Typography variant="body2" sx={{ color: '#475467' }}>
          Chưa có lượt đặt
        </Typography>
      );
    }
    const visibleItems = items.slice(0, 3);
    const extra = items.length - visibleItems.length;
    return (
      <Stack spacing={0.25}>
        {visibleItems.map((item) => (
          <Typography
            key={`${item.id}-${item.startTime}`}
            variant="body2"
            sx={{ color: '#475467', fontWeight: 500 }}
          >
            {item.subCourt?.name ?? `Sân ${item.subCourt?.id ?? item.id}`} —{' '}
            {formatTimeLabel(item.startTime)} - {formatTimeLabel(item.endTime)}
          </Typography>
        ))}
        {extra > 0 && (
          <Typography variant="caption" sx={{ color: '#0f766e' }}>
            +{extra} lượt khác
          </Typography>
        )}
      </Stack>
    );
  };

  return (
    <SidebarPage
      items={sidebarItemsAdmin}
      user={sidebarUser}
      canOpenProfile
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Quản lý booking hệ thống
          </Typography>
          <Typography variant="body2" sx={{ color: '#4b5563' }}>
            Xem toàn bộ booking, lọc theo ngày và tìm nhanh theo email user hoặc
            tên cụm sân.
          </Typography>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <MuiTextField
              label="Tìm theo email user hoặc tên cụm sân"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarToday sx={{ color: '#475467' }} />
              <MuiTextField
                label="Lọc theo ngày"
                type="date"
                value={dateFilter}
                onChange={(e) => handleDateChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 200 }}
              />
              {dateFilter && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => handleDateChange('')}
                >
                  Xóa ngày
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>

        <Divider />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Người dùng</TableCell>
                <TableCell>Cụm sân</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Chi tiết thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Tổng tiền</TableCell>
                <TableCell>Hóa đơn</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không tìm thấy booking phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      <Stack spacing={0.25}>
                        <Typography sx={{ fontWeight: 600 }}>
                          {row.userName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475467' }}>
                          {row.userEmail}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.supperCourt}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>
                        {row.date !== '—'
                          ? new Date(row.date).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                          : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>{renderItemLines(row.items)}</TableCell>
                    <TableCell>
                      <Chip
                        label={STATUS_LABELS[row.status] ?? row.status}
                        color={STATUS_COLORS[row.status] ?? 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>
                        {formatCurrency(row.totalPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {row.billUrl ? (
                        <Button
                          component="a"
                          href={row.billUrl}
                          target="_blank"
                          rel="noreferrer"
                          size="small"
                        >
                          Xem bill
                        </Button>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#475467' }}>
                          Chưa có
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" justifyContent="flex-end">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Stack>
      </Stack>
    </SidebarPage>
  );
}
