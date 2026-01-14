import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { updateMyCourt } from '../services/ownerCourtService.js';
import { uploadImageWithPresignedKey } from '@booking/shared/api/uploadImage.js';

/**
 * Dialog chỉnh sửa thông tin cụm sân
 */
export default function EditCourtDialog({
  open,
  onClose,
  courtData,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerError, setBannerError] = useState('');

  useEffect(() => {
    if (courtData) {
      setFormData({
        name: courtData.name || '',
        phone: courtData.phone || '',
        email: courtData.email || '',
        website: courtData.website || '',
        imageUrl: courtData.imageUrl || '',
      });
    }
  }, [courtData]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateMyCourt(formData);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Không thể cập nhật thông tin cụm sân. Vui lòng thử lại.';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1f3f2b' }}>
          Chỉnh sửa thông tin cụm sân
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Tên cụm sân"
              value={formData.name}
              onChange={handleChange('name')}
              required
              fullWidth
            />

            <TextField
              label="Số điện thoại"
              value={formData.phone}
              onChange={handleChange('phone')}
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              fullWidth
            />

            <TextField
              label="Website"
              value={formData.website}
              onChange={handleChange('website')}
              fullWidth
            />

            <TextField
              label="URL hình ảnh"
              value={formData.imageUrl}
              onChange={handleChange('imageUrl')}
              fullWidth
              helperText="Link đến hình ảnh cụm sân"
            />
            <Box>
              <Button
                component="label"
                variant="outlined"
                size="small"
                disabled={!courtData?.id || bannerUploading}
                sx={{ textTransform: 'none' }}
              >
                {bannerUploading ? 'Đang tải...' : 'Tải banner lên từ thiết bị'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  hidden
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file || !courtData?.id) return;
                    setBannerError('');
                    setBannerUploading(true);
                    try {
                      const res = await uploadImageWithPresignedKey({
                        type: 'supperCourtBanner',
                        file,
                        supperCourtId: String(courtData.id),
                      });
                      setFormData((prev) => ({
                        ...prev,
                        imageUrl: res.publicUrl ?? prev.imageUrl,
                      }));
                    } catch (err) {
                      setBannerError(
                        err?.message ||
                          err?.response?.data?.message ||
                          'Không thể tải ảnh lên. Vui lòng thử lại.',
                      );
                    } finally {
                      setBannerUploading(false);
                      event.target.value = '';
                    }
                  }}
                />
              </Button>
              {bannerError && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  {bannerError}
                </Alert>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#22c55e',
              '&:hover': { bgcolor: '#16a34a' },
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
