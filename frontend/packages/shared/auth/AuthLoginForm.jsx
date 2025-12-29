import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '../api/axiosInstance.js';

const ENDPOINT_BY_SITE = {
  client: '/auth/login',
  owner: '/auth/login-owner',
  admin: '/auth/login-super-admin',
};

export default function AuthLoginForm({ site = 'client', onSuccess, title }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = ENDPOINT_BY_SITE[site] ?? ENDPOINT_BY_SITE.client;
      const { data } = await api.post(endpoint, { email, password });
      const payload = data.data ?? data;

      if (payload.accessToken && payload.refreshToken) {
        localStorage.setItem('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
      }

      if (onSuccess) {
        onSuccess({
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
        });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin.';
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
        maxWidth: 420,
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
          {title || 'Đăng nhập'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          Vui lòng nhập email và mật khẩu để tiếp tục
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

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
        label="Mật khẩu"
        type="password"
        fullWidth
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
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
          'Đăng nhập'
        )}
      </Button>
    </Box>
  );
}
