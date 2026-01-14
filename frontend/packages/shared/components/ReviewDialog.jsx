import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Rating from '@mui/material/Rating';

export default function ReviewDialog({
  open,
  onClose,
  onSubmit,
  submitting = false,
  errorMessage,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (open) {
      setRating(5);
      setComment('');
    }
  }, [open]);

  const handleConfirm = () => {
    if (!rating) return;
    onSubmit({
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Đánh giá cụm sân</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Chấm sao
            </Typography>
            <Rating
              name="review-rating"
              value={rating}
              onChange={(_, value) => setRating(value ?? 0)}
              precision={1}
            />
          </Box>
          <TextField
            label="Chia sẻ cảm nhận"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Nêu điểm nổi bật, trải nghiệm hoặc đề xuất"
            multiline
            minRows={3}
            fullWidth
          />
          {errorMessage && (
            <Alert severity="error" sx={{ py: 1 }}>
              {errorMessage}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Huỷ
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={submitting || rating < 1}
          startIcon={submitting ? <CircularProgress size={16} /> : null}
        >
          Gửi đánh giá
        </Button>
      </DialogActions>
    </Dialog>
  );
}

