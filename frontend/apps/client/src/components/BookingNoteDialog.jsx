import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Divider,
} from '@mui/material';

export default function BookingNoteDialog({
  open,
  onClose,
  onConfirm,
  initialNote = '',
  summary,
}) {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote || '');
  }, [initialNote, open]);

  const handleClose = () => {
    setNote(initialNote || '');
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.({ note: note.trim() });
  };

  const { date, totalPrice, items = [], subCourts = [] } = summary || {};

  const formattedItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    const nameById = new Map(
      (subCourts || []).map((s) => [String(s.id), s.name]),
    );

    return items.map((item, idx) => ({
      key: `${item.date}-${item.courtId}-${item.startTime}-${item.endTime}-${idx}`,
      date: item.date,
      courtName: nameById.get(String(item.courtId)) || `Sân ${item.courtId}`,
      timeRange: `${item.startTime} ~ ${item.endTime}`,
      price: item.price || 0,
    }));
  }, [items, subCourts]);

  const formattedTotal =
    typeof totalPrice === 'number'
      ? `${totalPrice.toLocaleString('vi-VN')} đ`
      : '—';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
        Xác nhận đơn đặt sân
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 1.5, pb: 1.5 }}>
        <Stack spacing={2}>
          {/* Tóm tắt lịch đặt */}
          <Stack spacing={0.5}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: '#111827' }}
            >
              Thông tin lịch đặt
            </Typography>
            {date && (
              <Typography variant="body2" sx={{ color: '#4b5563' }}>
                Ngày: <strong>{date}</strong>
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: '#4b5563' }}>
              Số slot: <strong>{items?.length || 0}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#4b5563' }}>
              Tổng tiền: <strong>{formattedTotal}</strong>
            </Typography>
          </Stack>

          {formattedItems.length > 0 && (
            <Stack spacing={0.5} sx={{ mt: 0.5 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: '#111827' }}
              >
                Chi tiết các khoảng giờ
              </Typography>
              {formattedItems.map((row) => (
                <Typography
                  key={row.key}
                  variant="body2"
                  sx={{ color: '#4b5563' }}
                >
                  - {row.courtName} • {row.timeRange} •{' '}
                  {row.price
                    ? `${row.price.toLocaleString('vi-VN')} đ`
                    : 'Chưa xác định'}
                </Typography>
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 1 }} />

          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: 13 }}>
            Bạn có thể thêm ghi chú cho chủ sân (ví dụ: &quot;Ưu tiên sân gần
            cửa&quot;, &quot;Thanh toán khi đến sân&quot;, ...). Trường này
            không bắt buộc.
          </Typography>

          <TextField
            label="Ghi chú"
            multiline
            minRows={3}
            maxRows={6}
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="text">
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            borderRadius: 999,
            textTransform: 'none',
            bgcolor: '#386641',
            '&:hover': { bgcolor: '#2d5234' },
          }}
        >
          Xác nhận & thanh toán
        </Button>
      </DialogActions>
    </Dialog>
  );
}
