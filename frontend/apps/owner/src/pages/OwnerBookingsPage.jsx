import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { SidebarPage } from '@booking/shared';
import { sidebarItemsOwner } from '@booking/shared/const/sidebarItems.js';
import {
  fetchOwnerBookings,
  fetchOwnerBookingDetail,
  updateBookingStatus,
} from '../services/ownerBookingService.js';
import { fetchSubCourts } from '../services/subCourtsService.js';
import toast from 'react-hot-toast';

const TIMES = [];
for (let h = 0; h <= 23; h += 1) {
  const hh = String(h).padStart(2, '0');
  TIMES.push(`${hh}:00`);
  TIMES.push(`${hh}:30`);
}
TIMES.push('24:00');

const parseTimeToMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map((v) => parseInt(v, 10));
  return h * 60 + m;
};

const formatMinutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export default function OwnerBookingsPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [bookings, setBookings] = useState([]);
  const [subCourts, setSubCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    syncUserFromStorage();
    loadData();
  }, [selectedDate]);

  const syncUserFromStorage = () => {
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        setCurrentUser(parsed);
      }
    } catch {
      setCurrentUser(null);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsData, subCourtsData] = await Promise.all([
        fetchOwnerBookings(selectedDate),
        fetchSubCourts(),
      ]);
      setBookings(bookingsData);
      setSubCourts(subCourtsData);
    } catch (err) {
      toast.error('Không thể tải dữ liệu đặt sân');
    } finally {
      setLoading(false);
    }
  };

  const getSlotStatus = (subCourtId, time) => {
    const bookingsForCourt = bookings.filter((b) => {
      return b.items?.some((item) => {
        const itemSubCourtId = item.subCourt?.id || item.courtId;
        if (String(itemSubCourtId) !== String(subCourtId)) return false;
        if (item.date !== selectedDate) return false;

        const startTime = item.startTime?.slice(0, 5) || item.startTime;
        const endTime = item.endTime?.slice(0, 5) || item.endTime;
        const startMinutes = parseTimeToMinutes(startTime);
        const endMinutes = parseTimeToMinutes(endTime);
        const slotMinutes = parseTimeToMinutes(time);

        return slotMinutes >= startMinutes && slotMinutes < endMinutes;
      });
    });

    if (bookingsForCourt.length === 0) return 'available';

    // Lấy booking đầu tiên (nếu có nhiều booking trùng slot)
    const booking = bookingsForCourt[0];
    const status = booking.status?.toLowerCase() || 'pending';

    if (status === 'confirmed') return 'booked';
    if (status === 'pending') return 'pending';
    if (status === 'cancelled') return 'cancelled';
    return 'pending';
  };

  const getBookingForSlot = (subCourtId, time) => {
    return bookings.find((b) => {
      return b.items?.some((item) => {
        const itemSubCourtId = item.subCourt?.id || item.courtId;
        if (String(itemSubCourtId) !== String(subCourtId)) return false;
        if (item.date !== selectedDate) return false;

        const startTime = item.startTime?.slice(0, 5) || item.startTime;
        const endTime = item.endTime?.slice(0, 5) || item.endTime;
        const startMinutes = parseTimeToMinutes(startTime);
        const endMinutes = parseTimeToMinutes(endTime);
        const slotMinutes = parseTimeToMinutes(time);

        return slotMinutes >= startMinutes && slotMinutes < endMinutes;
      });
    });
  };

  const handleSlotClick = async (subCourtId, time) => {
    const booking = getBookingForSlot(subCourtId, time);

    // Nếu slot trống, hiển thị thông báo
    if (!booking) {
      toast.info('Slot này chưa có đơn đặt sân');
      return;
    }

    try {
      setDetailDialogOpen(true);
      setDetailLoading(true);
      setSelectedBooking(null);
      const detail = await fetchOwnerBookingDetail(booking.id);
      setSelectedBooking(detail);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Không thể tải chi tiết đặt sân. Vui lòng thử lại.';
      toast.error(message);
      setDetailDialogOpen(false);
      setSelectedBooking(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedBooking) return;

    try {
      setStatusUpdating(true);
      await updateBookingStatus(selectedBooking.id, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      setDetailDialogOpen(false);
      loadData();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Không thể cập nhật trạng thái. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setStatusUpdating(false);
    }
  };

  const renderSlotCell = (subCourtId, time) => {
    const status = getSlotStatus(subCourtId, time);
    const hasBooking = status !== 'available';

    let bgColor = '#ffffff';
    let hoverBg = '#f3f4f6';
    let cursor = 'default';

    if (status === 'booked') {
      bgColor = '#fecaca';
      hoverBg = '#fca5a5';
      cursor = 'pointer';
    } else if (status === 'pending') {
      bgColor = '#e5e7eb';
      hoverBg = '#d1d5db';
      cursor = 'pointer';
    } else if (status === 'cancelled') {
      bgColor = '#f3f4f6';
      hoverBg = '#e5e7eb';
      cursor = 'pointer';
    } else {
      // Slot trống vẫn có thể click để xem thông tin
      cursor = 'pointer';
    }

    return (
      <TableCell
        key={time}
        onClick={() => handleSlotClick(subCourtId, time)}
        title={
          hasBooking
            ? 'Nhấn để xem chi tiết đơn đặt sân'
            : 'Slot trống - Nhấn để xem thông tin'
        }
        sx={{
          borderRight: '1px solid #e5e7eb',
          borderTop: '1px solid #e5e7eb',
          p: 0,
          height: 32,
          cursor,
          bgcolor: bgColor,
          transition: 'background-color 150ms ease',
          '&:hover': {
            bgcolor: hoverBg,
            transform: 'scale(1.02)',
          },
        }}
      />
    );
  };

  const sidebarItems = sidebarItemsOwner;

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
      items={sidebarItems}
      canOpenProfile={!!currentUser}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f3f2b' }}>
            Quản lý đặt sân
          </Typography>
        </Box>

        <Box
          sx={{
            maxWidth: '100%',
            mx: 'auto',
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.18)',
            borderRadius: 3,
            overflow: 'hidden',
            mb: 3,
          }}
        >
          {/* Header + Legend */}
          <Box
            sx={{
              bgcolor: '#386641',
              color: 'white',
              p: 2.5,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: 'white',
                  border: '1px solid rgba(148, 163, 184, 0.8)',
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="caption">Trống</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: '#fecaca',
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="caption">Đã xác nhận</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  bgcolor: '#e5e7eb',
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="caption">Chờ xác nhận</Typography>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                px: 1.5,
                py: 0.75,
                borderRadius: 999,
              }}
            >
              <Typography component="span" sx={{ fontSize: 18 }}>
                📅
              </Typography>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: 12,
                }}
              />
            </Stack>
          </Box>

          {/* Bảng grid giờ/sân */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 0,
                borderTop: '1px solid #e5e7eb',
                maxHeight: 520,
              }}
            >
              <Box sx={{ overflowX: 'auto' }}>
                <Table
                  stickyHeader
                  size="small"
                  sx={{
                    minWidth: 1400,
                    '& th, & td': {
                      borderColor: '#e5e7eb',
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: 80,
                          bgcolor: '#ecfeff',
                          fontSize: 11,
                          fontWeight: 600,
                          textAlign: 'center',
                        }}
                      />
                      {TIMES.map((time) => (
                        <TableCell
                          key={time}
                          sx={{
                            bgcolor: '#cffafe',
                            fontSize: 10,
                            textAlign: 'center',
                            px: 0.5,
                            py: 0.5,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {time}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subCourts.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell
                          sx={{
                            bgcolor: '#ecfdf5',
                            fontSize: 11,
                            fontWeight: 600,
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            px: 1,
                          }}
                        >
                          {sub.name}
                        </TableCell>
                        {TIMES.map((time) => renderSlotCell(sub.id, time))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          )}
        </Box>
      </Box>

      {/* Dialog chi tiết booking */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1f3f2b' }}>
          Chi tiết đặt sân
        </DialogTitle>
        <DialogContent>
          {detailLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedBooking ? (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                  Mã đặt sân
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  #{selectedBooking.id}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                  Trạng thái
                </Typography>
                <Chip
                  label={
                    selectedBooking.status === 'confirmed'
                      ? 'Đã xác nhận'
                      : selectedBooking.status === 'pending'
                      ? 'Chờ xác nhận'
                      : selectedBooking.status === 'cancelled'
                      ? 'Đã hủy'
                      : selectedBooking.status || 'Chờ xác nhận'
                  }
                  color={
                    selectedBooking.status === 'confirmed'
                      ? 'success'
                      : selectedBooking.status === 'pending'
                      ? 'default'
                      : 'error'
                  }
                  size="small"
                />
              </Box>

              {selectedBooking.user && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: '#6b7280', mb: 0.5 }}
                  >
                    Khách hàng
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedBooking.user.name ||
                      selectedBooking.user.fullName ||
                      selectedBooking.user.email ||
                      'N/A'}
                  </Typography>
                  {selectedBooking.user.phone && (
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      {selectedBooking.user.phone}
                    </Typography>
                  )}
                  {selectedBooking.user.email && (
                    <Typography
                      variant="caption"
                      sx={{ color: '#6b7280', display: 'block' }}
                    >
                      {selectedBooking.user.email}
                    </Typography>
                  )}
                </Box>
              )}

              {selectedBooking.totalPrice && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: '#6b7280', mb: 0.5 }}
                  >
                    Tổng tiền
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(selectedBooking.totalPrice)}
                  </Typography>
                </Box>
              )}

              {selectedBooking.note && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: '#6b7280', mb: 0.5 }}
                  >
                    Ghi chú
                  </Typography>
                  <Typography variant="body1">
                    {selectedBooking.note}
                  </Typography>
                </Box>
              )}

              {selectedBooking.imgBill && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: '#6b7280', mb: 0.5 }}
                  >
                    Ảnh hóa đơn
                  </Typography>
                  <Box
                    component="img"
                    src={selectedBooking.imgBill}
                    alt="Hóa đơn"
                    sx={{
                      width: '100%',
                      maxHeight: 300,
                      objectFit: 'contain',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                    }}
                  />
                </Box>
              )}

              {selectedBooking.expiredAt && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: '#6b7280', mb: 0.5 }}
                  >
                    Hết hạn thanh toán
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedBooking.expiredAt).toLocaleString(
                      'vi-VN',
                    )}
                  </Typography>
                </Box>
              )}

              {selectedBooking.items && selectedBooking.items.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                    Chi tiết đặt sân
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {selectedBooking.items.map((item, idx) => {
                      const startTime =
                        item.startTime?.slice(0, 5) || item.startTime;
                      const endTime = item.endTime?.slice(0, 5) || item.endTime;
                      const subCourtName =
                        item.subCourt?.name ||
                        item.subCourtName ||
                        `Sân ${item.subCourt?.id || item.courtId || 'N/A'}`;

                      return (
                        <Paper
                          key={idx}
                          sx={{
                            p: 1.5,
                            bgcolor: '#f5f8f5',
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {subCourtName} - {item.date}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: '#6b7280' }}
                          >
                            {startTime} - {endTime}
                          </Typography>
                          {item.price && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#6b7280',
                                display: 'block',
                                mt: 0.5,
                              }}
                            >
                              Giá:{' '}
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(item.price)}
                            </Typography>
                          )}
                        </Paper>
                      );
                    })}
                  </Box>
                </Box>
              )}

              <Box>
                <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                  Cập nhật trạng thái
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={selectedBooking.status || 'pending'}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={statusUpdating}
                    label="Trạng thái"
                  >
                    <MenuItem value="pending">Chờ xác nhận</MenuItem>
                    <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          ) : (
            <Alert severity="warning">Không tìm thấy thông tin đặt sân</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </SidebarPage>
  );
}
