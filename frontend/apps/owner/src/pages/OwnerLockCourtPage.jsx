import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import toast from 'react-hot-toast';
import { SidebarPage } from '@booking/shared';
import { sidebarItemsOwner } from '@booking/shared/const/sidebarItems.js';
import { getMyCourt } from '../services/ownerCourtService.js';
import {
  fetchCourtCalendar,
  fetchCourtPriceMatrix,
  lockCourt,
} from '../services/ownerLockService.js';

const TIMES = [];
for (let h = 0; h <= 23; h += 1) {
  const hh = String(h).padStart(2, '0');
  TIMES.push(`${hh}:00`);
  TIMES.push(`${hh}:30`);
}
TIMES.push('24:00');

const SLOT_MINUTES = 30;

const parseTimeToMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map((v) => parseInt(v, 10));
  return h * 60 + m;
};

const formatMinutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const buildBookingItemsFromSelectedSlots = (selectedSlots, priceMatrix, subCourts) => {
  const groups = {};

  selectedSlots.forEach((key) => {
    const [date, court, time] = key.split('|');
    const minutes = parseTimeToMinutes(time);

    if (!groups[date]) groups[date] = {};
    if (!groups[date][court]) groups[date][court] = new Set();
    groups[date][court].add(minutes);
  });

  const items = [];

  Object.entries(groups).forEach(([date, courts]) => {
    const jsDate = new Date(`${date}T00:00:00`);
    const dayOfWeek = Number.isNaN(jsDate.getTime()) ? null : jsDate.getDay();

    Object.entries(courts).forEach(([courtId, minutesSet]) => {
      const minutesList = Array.from(minutesSet).sort((a, b) => a - b);
      if (!minutesList.length) return;

      const ranges = [];
      let rangeStart = minutesList[0];
      let prev = minutesList[0];

      const buildRange = (start, end) => {
        if (start >= end) return;
        ranges.push([start, end]);
      };

      for (let i = 1; i < minutesList.length; i += 1) {
        const current = minutesList[i];
        if (current !== prev + SLOT_MINUTES) {
          buildRange(rangeStart, prev + SLOT_MINUTES);
          rangeStart = current;
        }
        prev = current;
      }

      buildRange(rangeStart, prev + SLOT_MINUTES);

      const subCourtName =
        subCourts?.find((s) => Number(s.id) === Number(courtId))?.name ||
        `Sân ${courtId}`;

      ranges.forEach(([startMinutes, endMinutes]) => {
        let totalPrice = 0;
        if (
          priceMatrix &&
          dayOfWeek !== null &&
          Array.isArray(priceMatrix[dayOfWeek])
        ) {
          for (
            let m = startMinutes;
            m < endMinutes;
            m += SLOT_MINUTES
          ) {
            const slotIndex = m / SLOT_MINUTES;
            const slot = priceMatrix[dayOfWeek][slotIndex];
            if (slot && slot.price != null) {
              totalPrice += slot.price / 2;
            }
          }
        }

        items.push({
          date,
          courtId,
          courtName: subCourtName,
          startTime: formatMinutesToTime(startMinutes),
          endTime: formatMinutesToTime(endMinutes),
          price: totalPrice,
        });
      });
    });
  });

  return items;
};

const STATUS_STYLE = {
  booked: { bg: '#fecaca', hover: '#fca5a5', cursor: 'not-allowed' },
  pending: { bg: '#e5e7eb', hover: '#d1d5db', cursor: 'not-allowed' },
  locked: { bg: '#9ca3af', hover: '#9ca3af', cursor: 'not-allowed' },
  out_of_system: { bg: '#c084fc', hover: '#c084fc', cursor: 'not-allowed' },
  selecting: { bg: '#22c55e', hover: '#16a34a', cursor: 'pointer' },
};

export default function OwnerLockCourtPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [courtData, setCourtData] = useState(null);
  const [courtId, setCourtId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [bookingMatrix, setBookingMatrix] = useState(null);
  const [priceMatrix, setPriceMatrix] = useState(null);
  const [subCourts, setSubCourts] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loadingMatrix, setLoadingMatrix] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [note, setNote] = useState('');
  const [locking, setLocking] = useState(false);

  useEffect(() => {
    syncUserFromStorage();
    loadOwnerCourt();
  }, []);

  useEffect(() => {
    if (courtId) {
      loadCalendar();
    }
  }, [courtId, selectedDate]);

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

  const loadOwnerCourt = async () => {
    try {
      const data = await getMyCourt();
      setCourtData(data);
      setCourtId(data?.id ?? null);
    } catch (err) {
      toast.error('Không thể lấy thông tin cụm sân của bạn.');
    }
  };

  const loadCalendar = async () => {
    setLoadingMatrix(true);
    try {
      const [calendarRes, priceRes] = await Promise.all([
        fetchCourtCalendar(courtId, selectedDate),
        fetchCourtPriceMatrix(courtId),
      ]);

      const calendar = calendarRes.data?.data ?? calendarRes.data ?? calendarRes;
      setBookingMatrix(calendar);
      setSubCourts(
        Array.isArray(calendar?.subCourts)
          ? calendar.subCourts.map((s) => ({
              id: Number(s.subCourtId),
              name: s.subCourtName,
            }))
          : [],
      );

      const price = priceRes.data?.data ?? priceRes.data ?? priceRes;
      setPriceMatrix(
        typeof price === 'object' && price !== null ? price : {},
      );
      setSelectedSlots([]);
    } catch (err) {
      toast.error('Không thể tải lịch và giá khoá sân.');
    } finally {
      setLoadingMatrix(false);
    }
  };

  const getSlotStatus = (subCourtId, time) => {
    const slotKey = `${selectedDate}|${subCourtId}|${time}`;
    const baseStatus = bookingMatrix?.subCourts?.find(
      (s) => Number(s.subCourtId) === Number(subCourtId),
    )?.map?.find((slot) => slot.startTime?.slice(0, 5) === time)?.status;

    const status = String(baseStatus || 'available').toLowerCase();

    if (status === 'confirmed') return 'booked';
    if (status === 'pending') return 'pending';
    if (status === 'locked') return 'locked';
    if (status === 'out_of_system') return 'out_of_system';

    if (selectedSlots.includes(slotKey)) return 'selecting';
    return 'available';
  };

  const toggleSlot = (subCourtId, time) => {
    const slotKey = `${selectedDate}|${subCourtId}|${time}`;
    const status = getSlotStatus(subCourtId, time);
    if (status !== 'available' && status !== 'selecting') return;
    setSelectedSlots((prev) =>
      prev.includes(slotKey)
        ? prev.filter((s) => s !== slotKey)
        : [...prev, slotKey],
    );
  };

  const handlePrepareLock = () => {
    if (!selectedSlots.length) {
      toast.info('Vui lòng chọn ít nhất một khoảng giờ.');
      return;
    }
    const items = buildBookingItemsFromSelectedSlots(
      selectedSlots,
      priceMatrix,
      subCourts,
    );
    if (!items.length) {
      toast.error('Không thể xác định các khoảng giờ.');
      return;
    }
    const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);
    setPendingPayload({
      date: selectedDate,
      totalPrice,
      items,
      supperCourtId: String(courtId),
      note,
    });
    setConfirmOpen(true);
  };

  const handleConfirmLock = async () => {
    if (!pendingPayload) return;
    setLocking(true);
    try {
      await lockCourt(pendingPayload);
      toast.success('Khoá sân thành công.');
      setSelectedSlots([]);
      setNote('');
      setConfirmOpen(false);
      loadCalendar();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Không thể khoá sân. Vui lòng thử lại.',
      );
    } finally {
      setLocking(false);
    }
  };

  const formattedItems = useMemo(() => {
    if (!pendingPayload?.items) return [];
    return pendingPayload.items.map((item, idx) => ({
      key: `${item.date}-${item.courtId}-${item.startTime}-${idx}`,
      ...item,
    }));
  }, [pendingPayload]);

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
      appBarTitle="Khoá sân"
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 0 },
          pb: 4,
          pt: 3,
        }}
      >
        <Box
          sx={{
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.18)',
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'white',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              p: 3,
              bgcolor: '#1f3f2b',
              color: 'white',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ bgcolor: '#22c55e', width: 40, height: 40 }}>
                {courtData?.name?.[0] || '?'}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {courtData?.name || 'Cụm sân của bạn'}
                </Typography>
                <Typography variant="body2">
                  Khoá các slot ngoài hệ thống
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="body2">📅</Typography>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    fontSize: 14,
                  }}
                />
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              borderTop: '1px solid #e5e7eb',
              p: 2.5,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              sx={{ mb: 2 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 16, height: 16, bgcolor: '#ffffff', border: '1px solid rgba(148,163,184,0.8)', borderRadius: 0.5 }} />
                <Typography variant="caption">Trống</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 16, height: 16, bgcolor: '#fecaca', borderRadius: 0.5 }} />
                <Typography variant="caption">Đã đặt</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 16, height: 16, bgcolor: '#e5e7eb', borderRadius: 0.5 }} />
                <Typography variant="caption">Chờ duyệt</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 16, height: 16, bgcolor: '#9ca3af', borderRadius: 0.5 }} />
                <Typography variant="caption">Khoá</Typography>
              </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 16, height: 16, bgcolor: '#22c55e', borderRadius: 0.5 }} />
              <Typography variant="caption">Bạn chọn</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 16, height: 16, bgcolor: '#c084fc', borderRadius: 0.5 }} />
              <Typography variant="caption">Out-of-system</Typography>
            </Stack>
            </Stack>

            <Box sx={{ maxHeight: 520, overflowX: 'auto' }}>
              <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 0 }}>
                <Table stickyHeader size="small" sx={{ minWidth: 1400 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 110, bgcolor: '#ecfeff', textAlign: 'center', fontWeight: 600 }}>
                        Sân
                      </TableCell>
                      {TIMES.map((time) => (
                        <TableCell
                          key={time}
                          sx={{
                            bgcolor: '#cffafe',
                            px: 0.5,
                            py: 0.5,
                            fontSize: 10,
                            textAlign: 'center',
                          }}
                        >
                          {time}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingMatrix ? (
                      <TableRow>
                        <TableCell colSpan={TIMES.length + 1} align="center">
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    ) : subCourts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={TIMES.length + 1} align="center">
                          Không có sân con nào.
                        </TableCell>
                      </TableRow>
                    ) : (
                      subCourts.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell
                            sx={{
                              bgcolor: '#ecfdf5',
                              textAlign: 'center',
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            {sub.name}
                          </TableCell>
                          {TIMES.map((time) => {
                            const status = getSlotStatus(sub.id, time);
                            const style = STATUS_STYLE[status] || {
                              bg: '#ffffff',
                              hover: '#f3f4f6',
                              cursor: 'pointer',
                            };
                            return (
                              <TableCell
                                key={time}
                                onClick={() => toggleSlot(sub.id, time)}
                                sx={{
                                  borderRight: '1px solid #e5e7eb',
                                  borderTop: '1px solid #e5e7eb',
                                  p: 0,
                                  height: 32,
                                  bgcolor: style.bg,
                                  cursor: style.cursor,
                                  '&:hover': {
                                    bgcolor: status === 'selecting' ? style.hover : style.bg,
                                  },
                                }}
                              />
                            );
                          })}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>

        {selectedSlots.length > 0 && (
          <Paper
            elevation={8}
            sx={{
              position: 'fixed',
              right: { xs: 16, md: 32 },
              bottom: { xs: 16, md: 32 },
              p: 2,
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              minWidth: 260,
            }}
          >
            <Typography variant="body2">
              Đã chọn{' '}
              <Typography component="span" sx={{ fontWeight: 600, color: '#2563eb' }}>
                {selectedSlots.length} slot
              </Typography>
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip size="small" color="success" label="Khoá ngoài hệ thống" sx={{ fontSize: 11 }} />
            </Stack>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1, borderRadius: 999, bgcolor: '#386641', '&:hover': { bgcolor: '#2d5234' } }}
              onClick={handlePrepareLock}
            >
              Mở dialog khoá sân
            </Button>
          </Paper>
        )}
      </Box>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Khoá slot ngoài hệ thống</DialogTitle>
        <DialogContent dividers>
          {pendingPayload && (
            <>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: '#475467' }}>
                  Ngày: <strong>{pendingPayload.date}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#475467' }}>
                  Tổng tiền: <strong>{pendingPayload.totalPrice?.toLocaleString('vi-VN')} đ</strong>
                </Typography>
              </Stack>

              <Box sx={{ mt: 2, maxHeight: 180, overflowY: 'auto' }}>
                {formattedItems.map((item) => (
                  <Typography key={item.key} variant="body2" sx={{ color: '#4b5563' }}>
                    - {item.courtName} ({item.startTime} - {item.endTime}) •{' '}
                    {item.price
                      ? `${item.price.toLocaleString('vi-VN')} đ`
                      : 'Chưa có giá'}
                  </Typography>
                ))}
              </Box>
            </>
          )}

          <Divider sx={{ my: 2 }} />
          <TextField
            label="Ghi chú"
            multiline
            minRows={3}
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="text">
            Huỷ
          </Button>
          <Button
            onClick={handleConfirmLock}
            variant="contained"
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              bgcolor: '#386641',
              '&:hover': { bgcolor: '#2d5234' },
            }}
            disabled={locking}
          >
            {locking ? 'Đang khoá...' : 'Xác nhận khoá sân'}
          </Button>
        </DialogActions>
      </Dialog>
    </SidebarPage>
  );
}

