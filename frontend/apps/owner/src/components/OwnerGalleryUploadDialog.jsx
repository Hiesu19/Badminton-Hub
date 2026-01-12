import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import toast from 'react-hot-toast';
import {
  createOwnerImage,
  requestGalleryImageUpload,
} from '../services/ownerImageService.js';

export default function OwnerGalleryUploadDialog({
  open,
  onClose,
  supperCourtId,
}) {
  const [position, setPosition] = useState(1);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!file) {
      setError('Vui lòng chọn ảnh trước khi tải lên.');
      return;
    }

    const contentType = file.type || 'image/jpeg';

    try {
      setLoading(true);
      const presignedRes = await requestGalleryImageUpload({
        supperCourtId,
        contentType,
        position,
      });

      const presignedData =
        presignedRes.data?.data ?? presignedRes.data ?? presignedRes;
      if (
        !presignedData?.url ||
        !presignedData?.fields ||
        !presignedData?.key
      ) {
        throw new Error('Không nhận được dữ liệu upload.');
      }

      const formData = new FormData();
      Object.entries(presignedData.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file);

      const uploadResponse = await fetch(presignedData.url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload lên AWS thất bại.');
      }

      await createOwnerImage({
        url:
          presignedData.publicUrl ??
          `${presignedData.url}${presignedData.fields.key}`,
        type: 'gallery',
        priority: position,
        key: presignedData.key,
        supperCourtId,
      });

      toast.success('Tải ảnh gallery thành công.');
      setFile(null);
      onClose?.();
    } catch (uploadError) {
      console.error(uploadError);
      setError(
        uploadError?.response?.data?.message ||
          uploadError?.message ||
          'Không thể tải ảnh. Vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Thêm ảnh gallery</DialogTitle>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Vị trí ưu tiên"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              helperText="Nhập số, giá trị nhỏ hơn hiển thị trước"
              fullWidth
              required
            />

            <TextField
              label="Chọn file ảnh"
              type="file"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Typography variant="caption" color="text.secondary">
              Upload ảnh JPG/PNG, dung lượng tối đa 5MB.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Huỷ
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            Tải lên
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
