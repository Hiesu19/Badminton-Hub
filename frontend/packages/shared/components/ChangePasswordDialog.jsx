import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { changePassword } from '../services/authService.js';
import { showSuccessToast, showErrorToast } from '../utils/toast.js';

export default function ChangePasswordDialog({ userId }) {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetFields = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleOpen = () => {
    setOpen(true);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    setOpen(false);
    setSubmitting(false);
    resetFields();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userId) {
      setError('Chưa tải được dữ liệu người dùng. Vui lòng thử lại sau.');
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ các trường.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận phải trùng nhau.');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const { message } = await changePassword({
        userId,
        oldPassword,
        newPassword,
      });
      const finalMessage = message || 'Đã thay đổi mật khẩu.';
      setSuccess(finalMessage);
      showSuccessToast(finalMessage);
      resetFields();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      const finalMessage = Array.isArray(message) ? message.join(', ') : message;
      setError(finalMessage);
      showErrorToast(finalMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
        disabled={!userId}
        sx={{ textTransform: 'none' }}
      >
        Đổi mật khẩu
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Thay đổi mật khẩu</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            <TextField
              label="Mật khẩu hiện tại"
              type="password"
              size="small"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              required
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              size="small"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              type="password"
              size="small"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            <Typography variant="body2" color="text.secondary">
              API chung: POST /auth/change-password
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            onClick={handleSubmit}
            sx={{ textTransform: 'none' }}
          >
            {submitting ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              'Lưu mật khẩu'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

