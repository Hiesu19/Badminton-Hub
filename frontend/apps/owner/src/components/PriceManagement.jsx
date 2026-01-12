import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  getCourtPrices,
  bulkUpdateCourtPrices,
  copyCourtPrices,
} from '../services/ownerCourtService.js';
import toast from 'react-hot-toast';

const DAYS_OF_WEEK = [
  'Chủ nhật',
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
];

/**
 * Component quản lý bảng giá
 */
export default function PriceManagement() {
  const [selectedDay, setSelectedDay] = useState(1); // Mặc định Thứ 2
  const [groupedPrices, setGroupedPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [copying, setCopying] = useState(false);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [copyFrom, setCopyFrom] = useState(1);
  const [copyTo, setCopyTo] = useState(2);
  const [bulkForm, setBulkForm] = useState({
    startTime: '08:00',
    endTime: '12:00',
    price: '',
  });

  useEffect(() => {
    loadPrices(selectedDay);
  }, [selectedDay]);

  const loadPrices = async (dayOfWeek) => {
    try {
      setLoading(true);
      const data = await getCourtPrices(dayOfWeek);
      setGroupedPrices(groupPrices(data));
    } catch (err) {
      toast.error('Không thể tải danh sách giá');
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (event, newValue) => {
    setSelectedDay(newValue);
    setCopyFrom(newValue);
    setCopyTo((newValue + 1) % 7);
  };

  const handleCopySubmit = async (e) => {
    e.preventDefault();
    setCopyError('');
    if (copyFrom === copyTo) {
      setCopyError('Vui lòng chọn ngày đích khác ngày nguồn.');
      return;
    }
    try {
      setCopying(true);
      await copyCourtPrices(copyFrom, copyTo);
      toast.success('Copy cấu hình giá thành công');
      setCopyDialogOpen(false);
      setSelectedDay(copyTo);
      loadPrices(copyTo);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Không thể copy cấu hình giá. Vui lòng thử lại.';
      setCopyError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setCopying(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setBulkError('');
    if (!bulkForm.startTime || !bulkForm.endTime) {
      setBulkError('Vui lòng nhập giờ bắt đầu và kết thúc.');
      return;
    }

    const normalizeTime = (t) => {
      if (!t) return '';
      const trimmed = t.trim();
      if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed;
      if (/^\d{2}:\d{2}$/.test(trimmed)) return `${trimmed}:00`;
      return '';
    };

    const start = normalizeTime(bulkForm.startTime);
    const end = normalizeTime(bulkForm.endTime);

    if (!start || !end) {
      setBulkError('Thời gian không hợp lệ, định dạng HH:mm hoặc HH:mm:ss.');
      return;
    }

    if (start >= end) {
      setBulkError('Giờ bắt đầu phải nhỏ hơn giờ kết thúc.');
      return;
    }

    try {
      setBulkSubmitting(true);
      await bulkUpdateCourtPrices({
        dayOfWeek: selectedDay,
        startTime: start,
        endTime: end,
        pricePerHour: Number(bulkForm.price),
      });
      toast.success('Cập nhật giá theo dải giờ thành công');
      setBulkDialogOpen(false);
      loadPrices(selectedDay);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Không thể cập nhật giá theo dải giờ. Vui lòng thử lại.';
      setBulkError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setBulkSubmitting(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    // Giả sử time là dạng HH:mm hoặc HH:mm:ss
    return time.substring(0, 5);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const groupPrices = (items) => {
    if (!items || items.length === 0) return [];
    const sorted = [...items].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
    const ranges = [];
    let current = null;

    const normalizeTime = (t) => (t?.length === 8 ? t : `${t}:00`);

    for (const item of sorted) {
      const start = normalizeTime(item.startTime);
      const end = normalizeTime(item.endTime);
      const price = item.pricePerHour ?? item.price;
      if (current && current.price === price && current.endTime === start) {
        current.endTime = end;
      } else {
        if (current) ranges.push(current);
        current = {
          startTime: start,
          endTime: end,
          price,
          items: [item],
        };
      }
    }
    if (current) ranges.push(current);
    return ranges;
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f3f2b' }}>
          Quản lý bảng giá
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setBulkError('');
            setBulkDialogOpen(true);
          }}
          sx={{
            bgcolor: '#22c55e',
            color: '#ffffff',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { bgcolor: '#16a34a' },
            mr: 1,
          }}
        >
          Áp dụng giá theo dải giờ
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setCopyError('');
            setCopyDialogOpen(true);
          }}
          sx={{
            borderColor: '#22c55e',
            color: '#166534',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { borderColor: '#16a34a', bgcolor: '#ecfdf3' },
          }}
        >
          Copy giá từ ngày khác
        </Button>
      </Box>

      {/* Tabs để chọn ngày */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={selectedDay}
          onChange={handleDayChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 100,
              fontWeight: 600,
            },
            '& .Mui-selected': {
              color: '#22c55e',
            },
          }}
        >
          {DAYS_OF_WEEK.map((day, index) => (
            <Tab key={index} label={day} value={index} />
          ))}
        </Tabs>
      </Paper>

      {/* Bảng giá theo ngày đã chọn */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : groupedPrices.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" textAlign="center" py={4}>
              Chưa có bảng giá cho {DAYS_OF_WEEK[selectedDay]}. Vui lòng liên hệ
              quản trị viên để thêm giá.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f8f5' }}>
                <TableCell sx={{ fontWeight: 700 }}>Giờ bắt đầu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Giờ kết thúc</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Giá (VNĐ/giờ)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedPrices.map((range, idx) => (
                <TableRow
                  key={`${range.startTime}-${range.endTime}-${idx}`}
                  hover
                >
                  <TableCell>{formatTime(range.startTime)}</TableCell>
                  <TableCell>{formatTime(range.endTime)}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {formatPrice(range.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog bulk update giá */}
      <Dialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <form onSubmit={handleBulkSubmit}>
          <DialogTitle sx={{ fontWeight: 700, color: '#1f3f2b' }}>
            Áp dụng giá theo dải giờ
          </DialogTitle>
          <DialogContent>
            {bulkError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {bulkError}
              </Alert>
            )}

            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
            >
              <TextField
                label="Thứ"
                value={DAYS_OF_WEEK[selectedDay]}
                InputProps={{ readOnly: true }}
                fullWidth
              />

              <Box
                sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
              >
                <TextField
                  label="Giờ bắt đầu"
                  type="text"
                  placeholder="HH:mm hoặc HH:mm:ss"
                  value={bulkForm.startTime}
                  onChange={(e) =>
                    setBulkForm({ ...bulkForm, startTime: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                  helperText="Nhập giờ tự do, ví dụ 08:30 hoặc 08:30:00"
                />
                <TextField
                  label="Giờ kết thúc"
                  type="text"
                  placeholder="HH:mm hoặc HH:mm:ss"
                  value={bulkForm.endTime}
                  onChange={(e) =>
                    setBulkForm({ ...bulkForm, endTime: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  required
                  helperText="Nhập giờ tự do, ví dụ 12:00 hoặc 12:00:00"
                />
              </Box>

              <TextField
                label="Giá (VNĐ/giờ)"
                type="number"
                value={bulkForm.price}
                onChange={(e) =>
                  setBulkForm({ ...bulkForm, price: e.target.value })
                }
                fullWidth
                required
                inputProps={{ min: 0 }}
                helperText="Áp dụng cho tất cả slot 30 phút trong dải giờ này"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setBulkDialogOpen(false)}
              disabled={bulkSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={bulkSubmitting}
              sx={{
                bgcolor: '#22c55e',
                '&:hover': { bgcolor: '#16a34a' },
              }}
            >
              {bulkSubmitting ? <CircularProgress size={20} /> : 'Áp dụng'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog copy cấu hình giá */}
      <Dialog
        open={copyDialogOpen}
        onClose={() => setCopyDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <form onSubmit={handleCopySubmit}>
          <DialogTitle sx={{ fontWeight: 700, color: '#1f3f2b' }}>
            Copy cấu hình giá
          </DialogTitle>
          <DialogContent>
            {copyError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {copyError}
              </Alert>
            )}

            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
            >
              <TextField
                select
                label="Copy từ (thứ)"
                value={copyFrom}
                onChange={(e) => setCopyFrom(Number(e.target.value))}
                SelectProps={{ native: true }}
                fullWidth
                required
              >
                {DAYS_OF_WEEK.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </TextField>

              <TextField
                select
                label="Copy sang (thứ)"
                value={copyTo}
                onChange={(e) => setCopyTo(Number(e.target.value))}
                SelectProps={{ native: true }}
                fullWidth
                required
              >
                {DAYS_OF_WEEK.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setCopyDialogOpen(false)} disabled={copying}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={copying}
              sx={{
                bgcolor: '#22c55e',
                '&:hover': { bgcolor: '#16a34a' },
              }}
            >
              {copying ? <CircularProgress size={20} /> : 'Thực hiện copy'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
