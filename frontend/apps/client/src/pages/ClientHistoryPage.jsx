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

const BookingCard = ({ booking, onOpenDetail }) => {
  const primaryItem = booking.items?.[0];
  const timeLabel =
    primaryItem && primaryItem.startTime && primaryItem.endTime
      ? `${primaryItem.startTime
          .split(':')
          .slice(0, 2)
          .join(':')} - ${primaryItem.endTime.split(':').slice(0, 2).join(':')}`
      : '—';
  const totalItems = booking.items?.length ?? 0;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 1.5,
        p: 2.5,
        borderRadius: 3,
        border: '1px solid #e5e7eb',
        bgcolor: '#fdfdfd',
        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)',
      }}
    >
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Stack spacing={1} flexGrow={1} sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, color: '#0f172a' }}
            >
              #{booking.id}
            </Typography>
            <Typography variant="body2" sx={{ color: '#475467' }} noWrap>
              {booking.supperCourt?.name ?? '—'}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <Typography variant="body2" sx={{ color: '#475467' }}>
              Ngày: {primaryItem?.date ?? '—'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#475467' }}>
              Giờ: {timeLabel}
            </Typography>
            <Chip
              label={statusLabel(booking.status)}
              color={statusColor(booking.status)}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Stack>
        <Stack spacing={1} alignItems="flex-end">
          <Typography variant="body2" sx={{ color: '#475467' }}>
            Tổng tiền
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {booking.totalPrice
              ? `${Number(booking.totalPrice).toLocaleString('vi-VN')} đ`
              : '—'}
          </Typography>
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
        </Stack>
      </Stack>

      {totalItems > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
          {booking.items.slice(0, 3).map((it, index) => (
            <Chip
              key={`${it.id ?? index}-${it.startTime}`}
              label={`${it.subCourt?.name ?? `Sân ${it.courtId}`} · ${
                it.startTime ?? '—'
              } - ${it.endTime ?? '—'}`}
              size="small"
              sx={{ bgcolor: '#f1f5f9', borderRadius: 2 }}
            />
          ))}
          {totalItems > 3 && (
            <Typography
              variant="caption"
              sx={{ color: '#475467', alignSelf: 'center' }}
            >
              +{totalItems - 3} lượt khác
            </Typography>
          )}
        </Stack>
      )}
    </Paper>
  );
};

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
          bgcolor: '#ffffff',
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
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              border: '1px solid #e5e7eb',
              bgcolor: '#ffffff',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.05)',
            }}
          >
            <Stack spacing={2}>
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
                mt: 3,
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
