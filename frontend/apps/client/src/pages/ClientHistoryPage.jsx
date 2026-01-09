import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button,
    Stack,
    Chip,
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

function statusLabel(status) {
    if (!status) return '—';
    const s = String(status).toLowerCase();
    if (s === 'pending') return 'Chờ xác nhận';
    if (s === 'confirmed') return 'Đã xác nhận';
    if (s === 'cancelled') return 'Đã huỷ';
    return status;
}

function statusColor(status) {
    const s = String(status || '').toLowerCase();
    if (s === 'pending') return 'warning';
    if (s === 'confirmed') return 'success';
    if (s === 'cancelled') return 'default';
    return 'default';
}

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

    const load = async () => {
        setLoading(true);
        try {
            const res = await getMyBookings({
                date: selectedDate,
                page,
                limit: 10,
            });
            // backend may return { items: [...] } or an array
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
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: 2,
                            mb: 2.5,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 800, color: '#111827' }}
                            >
                                Lịch sử đặt sân
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: '#6b7280', mt: 0.4 }}
                            >
                                Xem lại các đơn trong ngày bạn chọn, kèm trạng
                                thái và bill.
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{ color: '#374151', fontWeight: 600 }}
                            >
                                Chọn ngày:
                            </Typography>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setPage(1);
                                }}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: 10,
                                    border: '1px solid #cbd5e1',
                                    fontSize: 14,
                                    background: '#fff',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                }}
                            />
                        </Box>
                    </Box>

                    <Paper
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            boxShadow: '0 20px 50px rgba(79, 70, 229, 0.08)',
                            border: '1px solid #e5e7eb',
                            bgcolor: '#ffffff',
                        }}
                    >
                        <List>
                            {bookings.length === 0 && (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            loading
                                                ? 'Đang tải...'
                                                : 'Chưa có lịch sử đặt sân.'
                                        }
                                    />
                                </ListItem>
                            )}

                            {bookings.map((b) => (
                                <ListItem
                                    key={b.id}
                                    sx={{
                                        mb: 1,
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 2,
                                        bgcolor: '#f9fafb',
                                        boxShadow:
                                            '0 8px 24px rgba(17, 24, 39, 0.04)',
                                        px: 2,
                                    }}
                                    secondaryAction={
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => openDetail(b.id)}
                                                sx={{
                                                    textTransform: 'none',
                                                    borderRadius: 999,
                                                    bgcolor: '#4f46e5',
                                                    '&:hover': {
                                                        bgcolor: '#4338ca',
                                                    },
                                                }}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </Stack>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                            >
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 800,
                                                        color: '#111827',
                                                    }}
                                                >
                                                    #{b.id}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: '#6b7280' }}
                                                >
                                                    {b.supperCourt?.name ?? '—'}
                                                </Typography>
                                            </Stack>
                                        }
                                        secondary={
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                alignItems="center"
                                                flexWrap="wrap"
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: '#374151' }}
                                                >
                                                    Ngày:{' '}
                                                    {b.items?.[0]?.date ?? '—'}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: '#374151' }}
                                                >
                                                    Tổng:{' '}
                                                    {b.totalPrice
                                                        ? `${Number(
                                                              b.totalPrice,
                                                          ).toLocaleString(
                                                              'vi-VN',
                                                          )} đ`
                                                        : '—'}
                                                </Typography>
                                                <Chip
                                                    label={statusLabel(
                                                        b.status,
                                                    )}
                                                    color={statusColor(
                                                        b.status,
                                                    )}
                                                    size="small"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Stack>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 1.5,
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{ color: '#4b5563' }}
                            >
                                Trang {page}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    disabled={page === 1 || loading}
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
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

                    <Dialog
                        open={detailOpen}
                        onClose={closeDetail}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>Chi tiết booking</DialogTitle>
                        <DialogContent dividers>
                            {selected ? (
                                <Stack spacing={1}>
                                    <Typography>
                                        {' '}
                                        Mã đơn: <strong>#{selected.id}</strong>
                                    </Typography>
                                    <Typography>
                                        {' '}
                                        Trạng thái:{' '}
                                        <strong>
                                            {statusLabel(selected.status)}
                                        </strong>
                                    </Typography>
                                    <Typography>
                                        {' '}
                                        Tổng tiền:{' '}
                                        <strong>
                                            {selected.totalPrice
                                                ? `${Number(
                                                      selected.totalPrice,
                                                  ).toLocaleString('vi-VN')} đ`
                                                : '—'}
                                        </strong>
                                    </Typography>

                                    {selected.items &&
                                        selected.items.length > 0 && (
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        mt: 1,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    Các mục
                                                </Typography>
                                                {selected.items.map(
                                                    (it, idx) => (
                                                        <Box
                                                            key={idx}
                                                            sx={{ py: 0.5 }}
                                                        >
                                                            <Typography variant="body2">
                                                                {it.date}{' '}
                                                                {it.startTime
                                                                    ? `(${it.startTime} - ${it.endTime})`
                                                                    : ''}{' '}
                                                                —{' '}
                                                                {it.subCourt
                                                                    ?.name ??
                                                                    it.courtId}
                                                            </Typography>
                                                        </Box>
                                                    ),
                                                )}
                                            </Box>
                                        )}

                                    {selected.imgBill && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography
                                                sx={{ fontWeight: 700 }}
                                            >
                                                Ảnh bill
                                            </Typography>
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
                            <Button onClick={closeDetail} variant="text">
                                Đóng
                            </Button>
                            {selected?.status === 'pending' && (
                                <Button
                                    color="error"
                                    onClick={handleCancel}
                                    disabled={canceling}
                                >
                                    Huỷ đơn
                                </Button>
                            )}
                            <Button
                                onClick={() => setBillOpen(true)}
                                variant="contained"
                            >
                                Gửi ảnh bill
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <BookingBillDialog
                        open={billOpen}
                        onClose={() => {
                            setBillOpen(false);
                            // refresh list and detail after upload
                            load();
                            if (selected?.id) openDetail(selected.id);
                        }}
                        booking={selected}
                    />
                </Box>
            </Box>
        </ClientSidebarLayout>
    );
}
