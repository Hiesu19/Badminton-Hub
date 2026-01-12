import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createCourt } from '../services/ownerCourtService.js';
import { uploadImageWithPresignedKey } from '@booking/shared';
import toast from 'react-hot-toast';

const REQUIRED_FIELDS = [
  { key: 'name', label: 'Tên cụm sân' },
  { key: 'description', label: 'Mô tả' },
  { key: 'address', label: 'Địa chỉ' },
  { key: 'addressLink', label: 'Link địa chỉ' },
  { key: 'latitude', label: 'Vĩ độ' },
  { key: 'longitude', label: 'Kinh độ' },
  { key: 'phone', label: 'Số điện thoại' },
  { key: 'bankName', label: 'Tên ngân hàng' },
  { key: 'bankAccountNumber', label: 'Số tài khoản' },
];

const createInitialForm = () => ({
  name: '',
  description: '',
  address: '',
  addressLink: '',
  latitude: '',
  longitude: '',
  phone: '',
  email: '',
  website: '',
  bankName: '',
  bankAccountNumber: '',
  imageUrl: '',
});

export default function RegisterCourtSection({ onSuccess, currentUser }) {
  const [formData, setFormData] = useState(createInitialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bannerUpload, setBannerUpload] = useState({
    uploading: false,
    fileName: '',
    url: '',
    key: '',
    error: '',
  });
  const [qrUpload, setQrUpload] = useState({
    uploading: false,
    fileName: '',
    url: '',
    key: '',
    error: '',
  });
  const ownerId = currentUser?.id?.toString();

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    for (const field of REQUIRED_FIELDS) {
      if (!formData[field.key]?.toString().trim()) {
        setError(`${field.label} là bắt buộc`);
        return;
      }
    }

    const latitude = Number(formData.latitude);
    const longitude = Number(formData.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setError('Vĩ độ và kinh độ phải là số hợp lệ');
      return;
    }

    const payload = {
      ...formData,
      latitude,
      longitude,
    };

    if (bannerUpload.url) {
      payload.imageUrl = bannerUpload.url;
    }
    if (qrUpload.url) {
      payload.qrCodeUrl = qrUpload.url;
    }

    setLoading(true);
    try {
      await createCourt(payload);
      toast.success(
        'Đăng ký cụm sân thành công. Vui lòng đợi quản trị viên duyệt.',
      );
      setFormData(createInitialForm());
      setBannerUpload({
        uploading: false,
        fileName: '',
        url: '',
        key: '',
        error: '',
      });
      setQrUpload({
        uploading: false,
        fileName: '',
        url: '',
        key: '',
        error: '',
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Không thể đăng ký cụm sân. Vui lòng thử lại.';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file, type, setState) => {
    if (!file) return;
    if (!ownerId) {
      setError('Không xác định được chủ sân, vui lòng đăng nhập lại.');
      return;
    }

    setState((prev) => ({
      ...prev,
      uploading: true,
      error: '',
    }));

    try {
      const { publicUrl, key } = await uploadImageWithPresignedKey({
        type,
        file,
        supperCourtId: ownerId,
      });

      setState({
        uploading: false,
        fileName: file.name,
        url: publicUrl,
        key,
        error: '',
      });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Không thể tải ảnh. Vui lòng thử lại.';
      setState((prev) => ({
        ...prev,
        uploading: false,
        error: Array.isArray(message) ? message.join(', ') : message,
      }));
    }
  };

  const handleBannerChange = async (event) => {
    const file = event.target.files?.[0];
    await uploadFile(file, 'supperCourtBanner', setBannerUpload);
    event.target.value = '';
  };

  const handleQrChange = async (event) => {
    const file = event.target.files?.[0];
    await uploadFile(file, 'supperCourtQr', setQrUpload);
    event.target.value = '';
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 18px 35px rgba(15, 46, 36, 0.1)',
      }}
    >
      <CardContent
        component="form"
        onSubmit={handleSubmit}
        sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f3f2b' }}>
          Đăng ký cụm sân mới
        </Typography>
        <Typography color="text.secondary">
          Hiện tại bạn chưa có cụm sân nào. Hãy tạo ngay để bắt đầu quản lý bảng
          giá và đặt slot cho khách hàng. Các thông tin sẽ được quản trị viên
          duyệt trước khi hiển thị công khai.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ fontSize: '0.95rem' }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label="Tên cụm sân"
            value={formData.name}
            onChange={handleChange('name')}
            required
            fullWidth
          />

          <TextField
            label="Mô tả"
            value={formData.description}
            onChange={handleChange('description')}
            required
            fullWidth
            multiline
            rows={3}
          />

          <TextField
            label="Địa chỉ"
            value={formData.address}
            onChange={handleChange('address')}
            required
            fullWidth
          />

          <TextField
            label="Link địa chỉ (Google Maps)"
            value={formData.addressLink}
            onChange={handleChange('addressLink')}
            required
            fullWidth
          />

          <TextField
            label="Latitude"
            value={formData.latitude}
            onChange={handleChange('latitude')}
            required
            fullWidth
            type="number"
            inputProps={{ step: 'any' }}
            helperText="VD: 21.004567"
          />

          <TextField
            label="Longitude"
            value={formData.longitude}
            onChange={handleChange('longitude')}
            required
            fullWidth
            type="number"
            inputProps={{ step: 'any' }}
            helperText="VD: 105.843123"
          />

          <TextField
            label="Số điện thoại"
            value={formData.phone}
            onChange={handleChange('phone')}
            required
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
            helperText="Link hình ảnh cụm sân (tùy chọn)"
          />

          <TextField
            label="Tên ngân hàng"
            value={formData.bankName}
            onChange={handleChange('bankName')}
            required
            fullWidth
          />

          <TextField
            label="Số tài khoản"
            value={formData.bankAccountNumber}
            onChange={handleChange('bankAccountNumber')}
            required
            fullWidth
          />

          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Ảnh banner (trên đầu trang)
            </Typography>
            <Button
              variant="outlined"
              component="label"
              sx={{
                borderStyle: 'dashed',
                borderRadius: 2,
                py: 2,
                textTransform: 'none',
              }}
              disabled={bannerUpload.uploading}
            >
              {bannerUpload.uploading
                ? 'Đang tải banner...'
                : bannerUpload.fileName
                ? 'Thay ảnh banner'
                : 'Chọn ảnh banner'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleBannerChange}
              />
            </Button>
            {bannerUpload.error && (
              <Typography color="error" variant="caption">
                {bannerUpload.error}
              </Typography>
            )}
            {bannerUpload.url && (
              <Box
                component="img"
                src={bannerUpload.url}
                alt="Banner preview"
                sx={{
                  width: '100%',
                  maxHeight: 180,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: '1px solid #e5e7eb',
                }}
              />
            )}
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              QR code thanh toán
            </Typography>
            <Button
              variant="outlined"
              component="label"
              sx={{
                borderStyle: 'dashed',
                borderRadius: 2,
                py: 2,
                textTransform: 'none',
              }}
              disabled={qrUpload.uploading}
            >
              {qrUpload.uploading
                ? 'Đang tải QR...'
                : qrUpload.fileName
                ? 'Thay QR code'
                : 'Chọn QR code'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleQrChange}
              />
            </Button>
            {qrUpload.error && (
              <Typography color="error" variant="caption">
                {qrUpload.error}
              </Typography>
            )}
            {qrUpload.url && (
              <Box
                component="img"
                src={qrUpload.url}
                alt="QR preview"
                sx={{
                  width: 180,
                  height: 180,
                  borderRadius: 1,
                  border: '1px solid #e5e7eb',
                  objectFit: 'cover',
                }}
              />
            )}
          </Stack>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#22c55e',
              '&:hover': { bgcolor: '#16a34a' },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Gửi yêu cầu đăng ký'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

