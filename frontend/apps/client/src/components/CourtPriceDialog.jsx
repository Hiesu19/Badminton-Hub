import React, { useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
} from '@mui/material';

const SLOT_MINUTES = 30;

const formatMinutesToTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const DAY_LABELS = {
    0: 'Chủ nhật',
    1: 'Thứ 2',
    2: 'Thứ 3',
    3: 'Thứ 4',
    4: 'Thứ 5',
    5: 'Thứ 6',
    6: 'Thứ 7',
};

const mergePriceRangesForDay = (slots) => {
    if (!Array.isArray(slots) || slots.length === 0) return [];

    const ranges = [];
    const len = slots.length;

    let i = 0;
    while (i < len) {
        const slot = slots[i];
        const price = slot?.price;

        if (price == null) {
            i += 1;
            continue;
        }

        const startIndex = i;
        let j = i + 1;

        while (j < len && slots[j] && slots[j].price === price) {
            j += 1;
        }

        const startMinutes = startIndex * SLOT_MINUTES;
        const endMinutes = j * SLOT_MINUTES;

        ranges.push({
            startMinutes,
            endMinutes,
            price,
        });

        i = j;
    }

    return ranges;
};

export default function CourtPriceDialog({ open, onClose, priceMatrix }) {
    const mergedByDay = useMemo(() => {
        if (!priceMatrix || typeof priceMatrix !== 'object') return [];

        const result = [];

        for (let day = 0; day <= 6; day += 1) {
            const slots = priceMatrix[day];
            const ranges = mergePriceRangesForDay(slots);
            if (ranges.length > 0) {
                result.push({ day, ranges });
            }
        }

        return result;
    }, [priceMatrix]);

    const hasData = mergedByDay.length > 0;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
                Bảng giá sân theo khung giờ
            </DialogTitle>
            <DialogContent dividers sx={{ pt: 2 }}>
                <Stack spacing={2}>
                    <Typography variant="body2" sx={{ color: '#4b5563' }}>
                        Giá hiển thị là giá tính theo giờ. Các khung giờ liên
                        tiếp có cùng giá đã được gộp lại thành một dải thời gian
                        để bạn dễ tra cứu.
                    </Typography>

                    {!hasData && (
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Chưa có dữ liệu bảng giá cho sân này.
                        </Typography>
                    )}

                    {hasData && (
                        <TableContainer
                            component={Paper}
                            sx={{ boxShadow: 'none' }}
                        >
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                width: 120,
                                                fontWeight: 700,
                                                fontSize: 13,
                                            }}
                                        >
                                            Thứ
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: 13,
                                            }}
                                        >
                                            Khung giờ & giá
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mergedByDay.map(({ day, ranges }) => (
                                        <TableRow key={day}>
                                            <TableCell
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {DAY_LABELS[day] ??
                                                    `Thứ ${day}`}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: 13 }}>
                                                <Stack spacing={0.5}>
                                                    {ranges.map((r, idx) => (
                                                        <Box
                                                            key={`${day}-${idx}`}
                                                        >
                                                            <Typography
                                                                component="span"
                                                                sx={{
                                                                    color: '#111827',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {formatMinutesToTime(
                                                                    r.startMinutes,
                                                                )}{' '}
                                                                ~{' '}
                                                                {formatMinutesToTime(
                                                                    r.endMinutes,
                                                                )}
                                                            </Typography>
                                                            <Typography
                                                                component="span"
                                                                sx={{
                                                                    color: '#16a34a',
                                                                    ml: 1,
                                                                }}
                                                            >
                                                                {r.price
                                                                    ? `${r.price.toLocaleString(
                                                                          'vi-VN',
                                                                      )} đ/giờ`
                                                                    : '—'}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} variant="contained">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}
