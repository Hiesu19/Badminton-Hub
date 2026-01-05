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
} from '@mui/material';
import BookingNoteDialog from '../components/BookingNoteDialog.jsx';
import { useSearchParams } from 'react-router-dom';
import {
  fetchPublicCourtCalendar,
  fetchPublicCourtPriceMatrix,
} from '../services/publicCourtsService.js';
import { createBooking } from '../services/bookingService.js';
const DEFAULT_SUB_COURTS = [];
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

const buildBookingItemsFromSelectedSlots = (selectedSlots, priceMatrix) => {
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
    const dayOfWeek = Number.isNaN(jsDate.getTime()) ? null : jsDate.getDay(); // 0=CN

    Object.entries(courts).forEach(([courtId, minutesSet]) => {
      const minutesList = Array.from(minutesSet).sort((a, b) => a - b);
      if (minutesList.length === 0) return;

      let rangeStart = minutesList[0];
      let prev = minutesList[0];

      const pushRange = (startMinutes, endMinutes) => {
        let totalPrice = 0;

        if (
          priceMatrix &&
          dayOfWeek !== null &&
          Array.isArray(priceMatrix[dayOfWeek])
        ) {
          for (let m = startMinutes; m < endMinutes; m += SLOT_MINUTES) {
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
          startTime: formatMinutesToTime(startMinutes),
          endTime: formatMinutesToTime(endMinutes),
          price: totalPrice,
        });
      };

      for (let i = 1; i <= minutesList.length; i += 1) {
        const current = minutesList[i];

        if (current !== prev + SLOT_MINUTES) {
          pushRange(rangeStart, prev + SLOT_MINUTES);
          rangeStart = current;
        }

        prev = current;
      }
    });
  });

  return items;
};

const ClientBookCourtPage = () => {
  const [searchParams] = useSearchParams();
  const courtIdParam = searchParams.get('courtId');

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [priceMatrix, setPriceMatrix] = useState(null);
  const [bookingMatrix, setBookingMatrix] = useState(null);
  const [subCourts, setSubCourts] = useState(
    DEFAULT_SUB_COURTS.map((name, index) => ({
      id: index + 1,
      name,
    })),
  );

  const getBaseStatusFromCalendar = (subCourtId, time) => {
    if (!bookingMatrix || !Array.isArray(bookingMatrix.subCourts)) {
      return 'available';
    }

    const numericId = Number(subCourtId);
    const sub = bookingMatrix.subCourts.find(
      (s) => Number(s.subCourtId) === numericId,
    );
    if (!sub || !Array.isArray(sub.map)) return 'available';

    const slotAtTime = sub.map.find((slot) => {
      if (!slot?.startTime) return false;
      const slotStart = slot.startTime.slice(0, 5);
      return slotStart === time;
    });

    if (!slotAtTime || !slotAtTime.status) return 'available';

    const status = String(slotAtTime.status).toLowerCase();
    if (status === 'pending') return 'pending';
    if (status === 'confirmed') return 'booked';
    if (status === 'locked') return 'locked';
    return 'available';
  };

  const toggleSlot = (subCourtId, time) => {
    const baseStatus = getBaseStatusFromCalendar(subCourtId, time);
    if (baseStatus !== 'available') return;

    const slotKey = `${selectedDate}|${subCourtId}|${time}`;
    setSelectedSlots((prev) =>
      prev.includes(slotKey)
        ? prev.filter((s) => s !== slotKey)
        : [...prev, slotKey],
    );
  };

  const getSlotStatus = (subCourtId, time) => {
    const slotKey = `${selectedDate}|${subCourtId}|${time}`;
    const baseStatus = getBaseStatusFromCalendar(subCourtId, time);
    if (baseStatus !== 'available') return baseStatus;

    if (selectedSlots.includes(slotKey)) {
      return 'selecting';
    }

    return 'available';
  };

  useEffect(() => {
    const loadData = async () => {
      if (!courtIdParam) return;
      try {
        const [matrix, calendar] = await Promise.all([
          fetchPublicCourtPriceMatrix(courtIdParam),
          fetchPublicCourtCalendar(courtIdParam, selectedDate),
        ]);
        setPriceMatrix(matrix);
        setBookingMatrix(calendar);

        if (calendar?.subCourts?.length) {
          setSubCourts(
            calendar.subCourts.map((s) => ({
              id: Number(s.subCourtId),
              name: s.subCourtName,
            })),
          );
        }
      } catch (error) {
        console.error('Không thể tải dữ liệu giá / lịch:', error);
        setPriceMatrix(null);
        setBookingMatrix(null);
      }
    };

    loadData();
  }, [courtIdParam, selectedDate]);

  const handleBooking = () => {
    const items = buildBookingItemsFromSelectedSlots(
      selectedSlots,
      priceMatrix,
    );

    const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

    const bookingBody = {
      note: '',
      totalPrice,
      supperCourtId: courtIdParam || undefined,
      items: items.map((item) => ({
        date: item.date,
        courtId: String(item.courtId),
        startTime: item.startTime,
        endTime: item.endTime,
        price: item.price,
      })),
    };

    setPendingPayload(bookingBody);
    setIsDialogOpen(true);
  };

  const handleConfirmBooking = async ({ note }) => {
    if (!pendingPayload) return;

    const finalPayload = {
      ...pendingPayload,
      note: note || '',
    };

    try {
      const data = await createBooking(finalPayload);
      console.log('Đặt sân thành công:', data);
      alert(
        'Đặt sân thành công! Bạn có thể xem chi tiết trong lịch sử đặt sân.',
      );
      setSelectedSlots([]);
      setIsDialogOpen(false);
      setPendingPayload(null);
    } catch (error) {
      console.error('Đặt sân thất bại:', error);
      const message =
        error?.response?.data?.message ||
        'Không thể tạo booking. Vui lòng thử lại sau.';
      alert(message);
    }
  };

  const renderSlotCell = (subCourtId, time) => {
    const status = getSlotStatus(subCourtId, time);

    let bgColor = '#ffffff';
    let hoverBg = '#f3f4f6';
    let cursor = 'pointer';

    if (status === 'booked') {
      // Đã đặt (đỏ)
      bgColor = '#fecaca';
      hoverBg = '#fca5a5';
      cursor = 'not-allowed';
    } else if (status === 'pending') {
      // Chờ xác nhận (xám)
      bgColor = '#e5e7eb';
      hoverBg = '#d1d5db';
      cursor = 'not-allowed';
    } else if (status === 'locked') {
      // Khoá hoàn toàn
      bgColor = '#9ca3af';
      hoverBg = '#9ca3af';
      cursor = 'not-allowed';
    } else if (status === 'selecting') {
      bgColor = '#22c55e';
      hoverBg = '#16a34a';
    }

    return (
      <TableCell
        key={time}
        onClick={() => toggleSlot(subCourtId, time)}
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
          },
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f3f4f6',
        p: { xs: 2, md: 3 },
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <Box
        sx={{
          maxWidth: '100%',
          mx: 'auto',
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.18)',
          borderRadius: 3,
          overflow: 'hidden',
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
                bgcolor: '#f2706e',
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Đã đặt</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: '#9ca3af',
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Khoá</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: '#c084fc',
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Sự kiện</Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="text"
            size="small"
            sx={{
              color: 'white',
              textDecoration: 'underline',
              textTransform: 'none',
              fontSize: 12,
            }}
          >
            Xem sân & bảng giá
          </Button>

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

        {/* Cảnh báo / Lưu ý */}
        <Box
          sx={{
            bgcolor: 'white',
            px: 2.5,
            py: 1.5,
            borderX: '1px solid #e5e7eb',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ color: '#ea580c', fontWeight: 700, mb: 0.5, fontSize: 12 }}
          >
            Lưu ý:
          </Typography>
          <Typography variant="body2" sx={{ color: '#4b5563', fontSize: 12 }}>
            - Thứ 7 + CN đặt tối thiểu 2 tiếng.
          </Typography>
          <Typography variant="body2" sx={{ color: '#4b5563', fontSize: 12 }}>
            - Vui lòng đặt liền, không để khoảng trống giữa các ca.
          </Typography>
          <Typography variant="body2" sx={{ color: '#4b5563', fontSize: 12 }}>
            - Hotline: 0965826481 - Zalo: 0964883235
          </Typography>
        </Box>

        {/* Bảng grid giờ/sân */}
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
      </Box>

      {/* Nút nổi tiếp tục đặt */}
      {selectedSlots.length > 0 && (
        <Paper
          elevation={10}
          sx={{
            position: 'fixed',
            right: { xs: 16, md: 32 },
            bottom: { xs: 16, md: 32 },
            p: 2,
            borderRadius: 2,
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            minWidth: 260,
          }}
        >
          <Typography variant="body2" sx={{ color: '#111827' }}>
            Đã chọn:{' '}
            <Typography
              component="span"
              sx={{ color: '#2563eb', fontWeight: 600 }}
            >
              {selectedSlots.length} slot
            </Typography>
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <Chip
              size="small"
              color="success"
              label="Xác nhận các ô màu xanh lá"
              sx={{ fontSize: 11 }}
            />
          </Stack>

          <Button
            variant="contained"
            onClick={handleBooking}
            sx={{
              mt: 0.5,
              borderRadius: 999,
              textTransform: 'none',
              bgcolor: '#386641',
              fontWeight: 700,
              '&:hover': {
                bgcolor: '#2d5234',
              },
            }}
          >
            Tiếp tục đặt sân
          </Button>
        </Paper>
      )}

      <BookingNoteDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmBooking}
        initialNote={pendingPayload?.note || ''}
      />
    </Box>
  );
};

export default ClientBookCourtPage;
