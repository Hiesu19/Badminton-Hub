import React, { useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,
    Box,
} from '@mui/material';
import { uploadImageWithPresignedKey } from '@booking/shared/api/uploadImage.js';
import { attachBookingBill } from '../services/bookingService.js';

export default function BookingBillDialog({ open, onClose, booking }) {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [remainingMs, setRemainingMs] = useState(null);

    const totalPriceNumber = useMemo(
        () => Number(booking?.totalPrice || 0),
        [booking?.totalPrice],
    );

    const primaryItem = booking?.items?.[0];
    const court = booking?.supperCourt || {};

    useEffect(() => {
        if (!open || !booking?.expiredAt) {
            setRemainingMs(null);
            return;
        }

        const end = new Date(booking.expiredAt).getTime();

        const tick = () => {
            const diff = end - Date.now();
            setRemainingMs(diff > 0 ? diff : 0);
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [open, booking?.expiredAt]);

    const countdownText = useMemo(() => {
        if (remainingMs == null) return null;
        const totalSec = Math.floor(remainingMs / 1000);
        const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
        const s = String(totalSec % 60).padStart(2, '0');
        return `${m}:${s}`;
    }, [remainingMs]);

    if (!booking) return null;

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
    };

    const handleConfirm = async () => {
        if (!file) {
            alert('Vui lòng chọn ảnh bill trước khi xác nhận.');
            return;
        }

        setLoading(true);
        try {
            // B1: lấy presigned URL cho bill
            const s3Result = await uploadImageWithPresignedKey({
                type: 'bookingBill',
                file,
                bookingId: String(booking.id),
            });

            // B2: gọi API gắn bill vào booking
            await attachBookingBill(booking.id, s3Result.publicUrl);
            alert('Gửi ảnh bill thành công! Đơn đang chờ chủ sân xác nhận.');
            setFile(null);
            setPreviewUrl('');
            onClose?.();
        } catch (error) {
            console.error('Upload bill thất bại:', error);
            const message =
                error?.response?.data?.message ||
                'Không thể gửi bill thanh toán. Vui lòng thử lại.';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
                Thanh toán & gửi ảnh bill
            </DialogTitle>
            <DialogContent dividers sx={{ pt: 2 }}>
                {/* Thanh trạng thái + countdown */}
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                    <Box
                        sx={{
                            bgcolor: '#ecfdf3',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Typography variant="body2" sx={{ color: '#166534' }}>
                            Vui lòng chuyển khoản đúng{' '}
                            <strong>
                                {totalPriceNumber
                                    ? `${totalPriceNumber.toLocaleString(
                                          'vi-VN',
                                      )} đ`
                                    : 'số tiền trong đơn'}
                            </strong>{' '}
                            và gửi ảnh bill lên để hoàn tất đặt lịch.
                        </Typography>
                    </Box>
                    {countdownText && (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="caption"
                                sx={{ color: '#4b5563', display: 'block' }}
                            >
                                Đơn của bạn còn được giữ chỗ trong
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 800,
                                    color: '#16a34a',
                                    mt: 0.5,
                                }}
                            >
                                {countdownText}
                            </Typography>
                        </Box>
                    )}
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    {/* Cột trái: hướng dẫn + thông tin tổng tiền */}
                    <Stack spacing={1.5} sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: '#4b5563' }}>
                            Vui lòng chuyển khoản theo thông tin chủ sân và tải
                            ảnh bill lên để hoàn tất đặt lịch.
                        </Typography>
                        <Box
                            sx={{
                                bgcolor: '#ecfdf3',
                                borderRadius: 2,
                                p: 1.5,
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 700, color: '#166534' }}
                            >
                                Thông tin đơn
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: '#166534', mt: 0.5 }}
                            >
                                Mã đơn: <strong>#{booking?.id ?? '—'}</strong>
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: '#166534' }}
                            >
                                Tổng tiền:{' '}
                                <strong>
                                    {totalPriceNumber
                                        ? `${totalPriceNumber.toLocaleString(
                                              'vi-VN',
                                          )} đ`
                                        : '—'}
                                </strong>
                            </Typography>
                            {primaryItem && (
                                <>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#166534' }}
                                    >
                                        Ngày:{' '}
                                        <strong>
                                            {primaryItem.date}{' '}
                                            {primaryItem.startTime &&
                                                primaryItem.endTime &&
                                                `(${primaryItem.startTime.slice(
                                                    0,
                                                    5,
                                                )} - ${primaryItem.endTime.slice(
                                                    0,
                                                    5,
                                                )})`}
                                        </strong>
                                    </Typography>
                                    {primaryItem.subCourt?.name && (
                                        <Typography
                                            variant="body2"
                                            sx={{ color: '#166534' }}
                                        >
                                            Sân:{' '}
                                            <strong>
                                                {primaryItem.subCourt.name}
                                            </strong>
                                        </Typography>
                                    )}
                                </>
                            )}
                        </Box>

                        <Box
                            sx={{
                                bgcolor: '#eff6ff',
                                borderRadius: 2,
                                p: 1.5,
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 700, color: '#1d4ed8' }}
                            >
                                Thông tin thanh toán
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: '#1d4ed8', mt: 0.5 }}
                            >
                                Ngân hàng:{' '}
                                <strong>{court.bankName || '—'}</strong>
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: '#1d4ed8' }}
                            >
                                Số tài khoản:{' '}
                                <strong>
                                    {court.bankAccountNumber || '—'}
                                </strong>
                            </Typography>
                        </Box>

                        {court.qrCodeUrl && (
                            <Box
                                sx={{
                                    mt: 1,
                                    alignSelf: 'flex-start',
                                    borderRadius: 2,
                                    border: '1px solid #e5e7eb',
                                    overflow: 'hidden',
                                    maxWidth: 180,
                                }}
                            >
                                <img
                                    src={court.qrCodeUrl}
                                    alt="QR thanh toán"
                                    style={{ width: '100%', display: 'block' }}
                                />
                            </Box>
                        )}
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            Sau khi gửi bill, vui lòng chờ chủ sân xác nhận.
                            Thời gian giữ chỗ phụ thuộc vào quy định từng sân.
                        </Typography>
                    </Stack>

                    {/* Cột phải: upload bill */}
                    <Stack spacing={1.5} sx={{ flex: 1 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, color: '#111827' }}
                        >
                            Ảnh bill thanh toán
                        </Typography>

                        <Button
                            variant="outlined"
                            component="label"
                            sx={{
                                borderStyle: 'dashed',
                                borderRadius: 2,
                                py: 3,
                                textTransform: 'none',
                            }}
                        >
                            Chọn hoặc kéo thả ảnh bill
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>

                        {previewUrl && (
                            <Box
                                sx={{
                                    mt: 1,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: '1px solid #e5e7eb',
                                }}
                            >
                                <img
                                    src={previewUrl}
                                    alt="Bill preview"
                                    style={{
                                        width: '100%',
                                        maxHeight: 320,
                                        objectFit: 'contain',
                                    }}
                                />
                            </Box>
                        )}
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={loading} variant="text">
                    Để sau
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    variant="contained"
                    sx={{
                        borderRadius: 999,
                        textTransform: 'none',
                        bgcolor: '#eab308',
                        '&:hover': { bgcolor: '#ca8a04' },
                    }}
                >
                    Gửi bill xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}
