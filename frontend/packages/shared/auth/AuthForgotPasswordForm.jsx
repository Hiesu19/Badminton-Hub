import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  requestForgotPassword,
  verifyForgotPassword,
} from '../services/authService.js';

/**
 * Form quên mật khẩu 2 bước:
 * - Bước 1: nhập email → gửi OTP
 * - Bước 2: nhập OTP + mật khẩu mới → đổi mật khẩu
 */
export default function AuthForgotPasswordForm({ site = 'client' }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const { message } = await requestForgotPassword({ email, site });
      setSuccessMessage(message);
      setStep(2);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Không thể gửi OTP. Vui lòng thử lại sau.';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const { message } = await verifyForgotPassword({
        email,
        otp,
        newPassword,
        site,
      });
      setSuccessMessage(message);
      navigate(`/login?site=${site}`);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Không thể đổi mật khẩu. Vui lòng kiểm tra lại OTP.';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={step === 1 ? handleRequestOtp : handleVerifyOtp}
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
          Quên mật khẩu
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          {step === 1
            ? 'Nhập email để nhận mã OTP khôi phục mật khẩu.'
            : 'Nhập mã OTP và mật khẩu mới để hoàn tất.'}
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
        label="Email"
        type="email"
        fullWidth
        required
        disabled={step === 2}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      {step === 2 && (
        <>
          <TextField
            label="Mã OTP"
            fullWidth
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </>
      )}

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
        ) : step === 1 ? (
          'Gửi OTP'
        ) : (
          'Đổi mật khẩu'
        )}
      </Button>
    </Box>
  );
}
