import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  getMyBookings,
  getBookingDetail,
  cancelMyBooking,
} from '../services/bookingService.js';
import BookingBillDialog from '../components/BookingBillDialog.jsx';
import ClientSidebarLayout from '../components/ClientSidebarLayout.jsx';

const statusLabel = (status) => {
  if (!status) return '—';
  const s = String(status).toLowerCase();
  if (s === 'pending') return 'Chờ xác nhận';
  if (s === 'confirmed') return 'Đã xác nhận';
  if (s === 'cancelled') return 'Đã huỷ';
  return status;
};

const statusColor = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'pending') return 'warning';
  if (s === 'confirmed') return 'success';
  if (s === 'cancelled') return 'default';
  return 'default';
};

const HistoryHeader = ({ selectedDate, onDateChange }) => (
  <Paper
    elevation={0}
    sx={{
      mb: 2.5,
      p: { xs: 2, md: 3 },
      borderRadius: 3,
      border: '1px solid #e2e8f0',
      bgcolor: '#ffffff',
      boxShadow: '0 20px 40px rgba(15, 23, 42, 0.05)',
    }}
  >
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'baseline' }}
      spacing={2}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
          Lịch sử đặt sân
        </Typography>
        <Typography variant="body2" sx={{ color: '#475467', mt: 0.5 }}>
          Lọc theo ngày để xem lại đơn hàng, trạng thái và ảnh billing.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: '#f8fafc',
          p: '6px 12px',
          borderRadius: 10,
          border: '1px solid #e2e8f0',
        }}
      >
        <Typography variant="body2" sx={{ color: '#475467', fontWeight: 600 }}>
          Ngày xem:
        </Typography>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            fontSize: 14,
            background: '#fff',
            boxShadow: '0 1px 2px rgba(15,23,42,0.05)',
          }}
        />
      </Box>
    </Stack>
  </Paper>
);

const BookingCard = ({ booking, onOpenDetail }) => (
  <Paper
    sx={{
      mb: 1.5,
      p: 2,
      borderRadius: 2,
      border: '1px solid #e5e7eb',
      bgcolor: '#f8fafc',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Stack direction="column" spacing={0.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 800, color: '#0f172a' }}
          >
            #{booking.id}
          </Typography>
          <Typography variant="body2" sx={{ color: '#475467' }}>
            {booking.supperCourt?.name ?? '—'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography variant="body2" sx={{ color: '#475467' }}>
            Ngày: {booking.items?.[0]?.date ?? '—'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#475467' }}>
            Tổng:{' '}
            {booking.totalPrice
              ? `${Number(booking.totalPrice).toLocaleString('vi-VN')} đ`
              : '—'}
          </Typography>
          <Chip
            label={statusLabel(booking.status)}
            color={statusColor(booking.status)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
      </Stack>
      <Box>
        <Button
          variant="contained"
          size="small"
          onClick={() => onOpenDetail(booking.id)}
          sx={{
            textTransform: 'none',
            borderRadius: 999,
            bgcolor: '#312e81',
            '&:hover': {
              bgcolor: '#2d2a78',
            },
          }}
        >
          Xem chi tiết
        </Button>
      </Box>
    </Stack>
  </Paper>
);

const BookingDetailDialog = ({
  open,
  selected,
  onClose,
  onCancel,
  onBill,
  canceling,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>Chi tiết booking</DialogTitle>
    <DialogContent dividers>
      {selected ? (
        <Stack spacing={1}>
          <Typography>
            Mã đơn: <strong>#{selected.id}</strong>
          </Typography>
          <Typography>
            Trạng thái: <strong>{statusLabel(selected.status)}</strong>
          </Typography>
          <Typography>
            Tổng tiền:{' '}
            <strong>
              {selected.totalPrice
                ? `${Number(selected.totalPrice).toLocaleString('vi-VN')} đ`
                : '—'}
            </strong>
          </Typography>
          {selected.items && selected.items.length > 0 && (
            <Box>
              <Typography sx={{ mt: 1, fontWeight: 700 }}>Các mục</Typography>
              {selected.items.map((it, idx) => (
                <Box key={idx} sx={{ py: 0.5 }}>
                  <Typography variant="body2">
                    {it.date}{' '}
                    {it.startTime ? `(${it.startTime} - ${it.endTime})` : ''} —{' '}
                    {it.subCourt?.name ?? it.courtId}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
          {selected.imgBill && (
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>Ảnh bill</Typography>
              <img
                src={selected.imgBill}
                alt="bill"
                style={{
                  maxWidth: '100%',
                  marginTop: 8,
                  borderRadius: 8,
                }}
              />
            </Box>
          )}
        </Stack>
      ) : (
        <Typography>Đang tải chi tiết...</Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="text">
        Đóng
      </Button>
      {selected?.status === 'pending' && (
        <Button color="error" onClick={onCancel} disabled={canceling}>
          Huỷ đơn
        </Button>
      )}
      <Button onClick={onBill} variant="contained">
        Gửi ảnh bill
      </Button>
    </DialogActions>
  </Dialog>
);

export default function ClientHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [viewingId, setViewingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMyBookings({ date: selectedDate, page, limit: 10 });
      const items = res?.items ?? res ?? [];
      setBookings(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Không thể tải lịch sử đặt sân:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [selectedDate, page]);

  const openDetail = async (id) => {
    try {
      const det = await getBookingDetail(id);
      setSelected(det);
      setViewingId(id);
      setDetailOpen(true);
    } catch (error) {
      console.error('Không thể tải chi tiết booking:', error);
      alert('Không thể tải chi tiết booking. Vui lòng thử lại.');
    }
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelected(null);
  };

  const handleCancel = async () => {
    if (!selected?.id) return;
    const confirmed = window.confirm('Bạn có chắc muốn huỷ đơn này?');
    if (!confirmed) return;
    setCanceling(true);
    try {
      await cancelMyBooking(selected.id);
      await load();
      const refreshed = await getBookingDetail(selected.id);
      setSelected(refreshed);
    } catch (error) {
      console.error('Huỷ booking thất bại:', error);
      alert('Không thể huỷ đơn. Vui lòng thử lại.');
    } finally {
      setCanceling(false);
    }
  };

  return (
    <ClientSidebarLayout>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#eef2ff',
          p: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
          <HistoryHeader
            selectedDate={selectedDate}
            onDateChange={(value) => {
              setSelectedDate(value);
              setPage(1);
            }}
          />

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid #e5e7eb',
              bgcolor: '#ffffff',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Stack spacing={1.5}>
              {loading && bookings.length === 0 && (
                <Typography variant="body2" sx={{ color: '#475467' }}>
                  Đang tải lịch sử đặt sân...
                </Typography>
              )}
              {!loading && bookings.length === 0 && (
                <Typography variant="body2" sx={{ color: '#475467' }}>
                  Chưa có lịch sử đặt sân trong ngày này.
                </Typography>
              )}
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onOpenDetail={openDetail}
                />
              ))}
            </Stack>

            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ color: '#475467' }}>
                Trang {page}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={page === 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Trang trước
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={bookings.length < 10 || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Trang sau
                </Button>
              </Box>
            </Box>
          </Paper>

          <BookingDetailDialog
            open={detailOpen}
            selected={selected}
            onClose={closeDetail}
            onCancel={handleCancel}
            onBill={() => setBillOpen(true)}
            canceling={canceling}
          />

          <BookingBillDialog
            open={billOpen}
            onClose={() => {
              setBillOpen(false);
              load();
              if (viewingId) openDetail(viewingId);
            }}
            booking={selected}
          />
        </Box>
      </Box>
    </ClientSidebarLayout>
  );
}
