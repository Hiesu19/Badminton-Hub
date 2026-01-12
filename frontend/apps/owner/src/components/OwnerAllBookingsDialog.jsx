import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
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
import { fetchOwnerAllBookings } from '../services/ownerBookingService.js';

const STATUSES = [
  { label: 'Tất cả', value: '' },
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đã xác nhận', value: 'confirmed' },
  { label: 'Từ chối', value: 'rejected' },
  { label: 'Đã hủy', value: 'cancelled' },
  { label: 'Khoá', value: 'locked' },
  { label: 'Out of system', value: 'out_of_system' },
];

export default function OwnerAllBookingsDialog({ open, onClose }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    loadData();
    return undefined;
  }, [open, statusFilter, startDate, endDate, page]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchOwnerAllBookings({
        status: statusFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        limit,
      });
      setData(res.items);
      setMetadata(res.metadata || {});
    } catch (err) {
      console.error('Không thể tải toàn bộ booking', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil((metadata.total ?? 0) / limit));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Toàn bộ booking owner</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              {STATUSES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Từ ngày"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Đến ngày"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="outlined" onClick={() => loadData()}>
            Refresh
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Người đặt</TableCell>
                <TableCell>Số tiền</TableCell>
                <TableCell>Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={20} />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có booking nào.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      {item.user?.fullName ||
                        item.user?.name ||
                        item.user?.email}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(item.totalPrice ?? 0)}
                    </TableCell>
                    <TableCell>{item.note || '—'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
