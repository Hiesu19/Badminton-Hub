import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
} from '@mui/material';

/**
 * Dialog nhập ghi chú và thông tin bổ sung khi đặt sân.
 */
export default function BookingNoteDialog({
  open,
  onClose,
  onConfirm,
  initialNote = '',
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
        Thông tin thêm cho đơn đặt sân
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 1.5 }}>
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: 13 }}>
            Bạn có thể ghi chú yêu cầu đặc biệt (ví dụ: &quot;Ưu tiên sân gần
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
          Xác nhận đặt sân
        </Button>
      </DialogActions>
    </Dialog>
  );
}
