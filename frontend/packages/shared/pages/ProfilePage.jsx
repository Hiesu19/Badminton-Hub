import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { fetchMyProfile, updateMyProfile } from '../services/userService.js';
import { uploadImageWithPresignedKey } from '../api/uploadImage.js';
import { showSuccessToast, showErrorToast } from '../utils/toast.js';

export default function ProfilePage({ title = 'Thông tin cá nhân' }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setError('');
      setSuccess('');
      setLoading(true);
      try {
        const profile = await fetchMyProfile();
        if (!mounted) return;

        setFullName(profile.fullName || profile.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
        setAvatarUrl(profile.avatarUrl || '');
      } catch (err) {
        if (!mounted) return;
        const message =
          err?.response?.data?.message ||
          'Không tải được thông tin cá nhân. Vui lòng thử lại.';
        setError(Array.isArray(message) ? message.join(', ') : message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const { user, message } = await updateMyProfile({
        fullName,
        phone,
        avatarUrl,
      });

      if (user) {
        setFullName(user.name || user.fullName || fullName);
        setPhone(user.phone ?? phone);
        setAvatarUrl(user.avatarUrl ?? avatarUrl);
      }

      const finalMessage = message || 'Cập nhật thông tin thành công';
      setSuccess(finalMessage);
      showSuccessToast(finalMessage);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Cập nhật thông tin thất bại. Vui lòng thử lại.';
      const finalMessage = Array.isArray(message)
        ? message.join(', ')
        : message;
      setError(finalMessage);
      showErrorToast(finalMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setUploadingAvatar(true);

    try {
      const { publicUrl } = await uploadImageWithPresignedKey({
        type: 'avatar',
        file,
      });

      if (!publicUrl) {
        throw new Error('Không nhận được đường dẫn ảnh từ S3');
      }

      const { user } = await updateMyProfile({ avatarUrl: publicUrl });

      setAvatarUrl(user?.avatarUrl || publicUrl);
      setSuccess('Cập nhật ảnh đại diện thành công.');
      showSuccessToast('Cập nhật ảnh đại diện thành công.');
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Upload ảnh avatar thất bại. Vui lòng thử lại.';
      const finalMessage = Array.isArray(message)
        ? message.join(', ')
        : message;
      setError(finalMessage);
      showErrorToast(finalMessage);
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 240,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 720,
        mx: 'auto',
        p: 4,
        borderRadius: 3,
        bgcolor: '#ffffff',
        boxShadow: '0 12px 40px rgba(15, 46, 36, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb',
          pb: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
            Profile
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Quản lý thông tin cá nhân của bạn.
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: '#22c55e',
            '&:hover': { bgcolor: '#16a34a' },
          }}
        >
          {saving ? (
            <CircularProgress size={22} sx={{ color: 'white' }} />
          ) : (
            'Lưu thay đổi'
          )}
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 160,
            height: 160,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1px solid #000',
          }}
        >
          <Avatar
            src={avatarUrl}
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: '#22c55e',
              fontWeight: 700,
              fontSize: 40,
            }}
          >
            {(fullName || email || 'U').trim()[0]?.toUpperCase()}
          </Avatar>

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0,0,0,0.35)',
              color: '#fff',
              opacity: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            {uploadingAvatar ? 'Đang upload ảnh...' : 'Cập nhật avatar'}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="subtitle1"
          sx={{ mt: 2, fontWeight: 600, color: '#111827' }}
        >
          {fullName || email || 'Người dùng'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          {email}
        </Typography>
      </Box>

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

      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          label="Họ và tên"
          fullWidth
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          value={email}
          disabled
          helperText="Email không thể thay đổi."
        />

        <TextField
          label="Số điện thoại"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0377xxxxxx"
        />
      </Box>
    </Box>
  );
}
