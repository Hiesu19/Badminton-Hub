import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { registerClientAccount } from '../services/authService.js';

export default function AuthRegisterForm({ onSuccess, title }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const { message } = await registerClientAccount({
        fullName,
        email,
        phone,
        password,
      });

      setSuccessMessage(message);
      if (onSuccess) {
        onSuccess(message);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Đăng ký thất bại, vui lòng kiểm tra lại thông tin.';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: 480,
        mx: 'auto',
        p: 4,
        borderRadius: 3,
        bgcolor: '#ffffff',
        boxShadow: '0 12px 40px rgba(15, 46, 36, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: '#1f3f2b', mb: 0.5 }}
        >
          {title || 'Đăng ký tài khoản'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          Tạo tài khoản mới để sử dụng hệ thống Badminton Hub
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          {successMessage}
        </Alert>
      )}

      <TextField
        label="Họ và tên"
        fullWidth
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <TextField
        label="Số điện thoại"
        fullWidth
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+8489xxxxxxx"
      />

      <TextField
        label="Mật khẩu"
        type="password"
        fullWidth
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        helperText="Ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          mt: 1,
          py: 1.2,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 16,
          bgcolor: '#22c55e',
          '&:hover': { bgcolor: '#16a34a' },
        }}
      >
        {loading ? (
          <CircularProgress size={22} sx={{ color: 'white' }} />
        ) : (
          'Đăng ký'
        )}
      </Button>
    </Box>
  );
}
