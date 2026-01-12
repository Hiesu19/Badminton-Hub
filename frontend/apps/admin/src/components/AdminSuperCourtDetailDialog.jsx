import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
  Typography,
} from '@mui/material';

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(value))
    : '—';

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, minWidth: 120 }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ color: '#0f172a' }}>
        {value ?? '—'}
      </Typography>
    </Stack>
  );
}

export default function AdminSuperCourtDetailDialog({ open, court, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết sân</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <DetailRow label="ID" value={court?.id ?? '—'} />
          <DetailRow label="Tên sân" value={court?.name || '—'} />
          <DetailRow label="Mô tả" value={court?.description || '—'} />
          <DetailRow label="Địa chỉ" value={court?.address || '—'} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, minWidth: 120 }}
            >
              Link bản đồ:
            </Typography>
            {court?.addressLink ? (
              <Link href={court.addressLink} target="_blank" rel="noreferrer">
                {court.addressLink}
              </Link>
            ) : (
              <Typography variant="body2" sx={{ color: '#0f172a' }}>
                —
              </Typography>
            )}
          </Stack>
          <DetailRow label="Điện thoại" value={court?.phone || '—'} />
          <DetailRow label="Email" value={court?.email || '—'} />
          <DetailRow label="Website" value={court?.website || '—'} />
          <DetailRow label="Ngân hàng" value={court?.bankName || '—'} />
          <DetailRow
            label="Số tài khoản"
            value={court?.bankAccountNumber || '—'}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Trạng thái:
            </Typography>
            <Chip
              label={court?.status || 'verifying'}
              size="small"
              color={court?.status === 'active' ? 'success' : 'default'}
            />
          </Stack>
          <DetailRow label="Chủ sân" value={court?.user?.name || '—'} />
          <DetailRow label="Ngày tạo" value={formatDate(court?.createdAt)} />
          <DetailRow
            label="Cập nhật lần cuối"
            value={formatDate(court?.updatedAt)}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, minWidth: 120 }}
            >
              Ảnh đại diện:
            </Typography>
            {court?.imageUrl ? (
              <Link href={court.imageUrl} target="_blank" rel="noreferrer">
                Xem ảnh
              </Link>
            ) : (
              <Typography variant="body2" sx={{ color: '#0f172a' }}>
                —
              </Typography>
            )}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, minWidth: 120 }}
            >
              QR code:
            </Typography>
            {court?.qrCodeUrl ? (
              <Link href={court.qrCodeUrl} target="_blank" rel="noreferrer">
                Lấy QR
              </Link>
            ) : (
              <Typography variant="body2" sx={{ color: '#0f172a' }}>
                —
              </Typography>
            )}
          </Stack>
          <DetailRow label="Kinh độ" value={court?.longitude || '—'} />
          <DetailRow label="Vĩ độ" value={court?.latitude || '—'} />
          <DetailRow label="Số lượng ảnh" value={court?.images?.length ?? 0} />
          <DetailRow label="Số lượt đặt sân" value={court?.bookingCount ?? 0} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
