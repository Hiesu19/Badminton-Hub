import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
      <Typography variant="subtitle2" sx={{ fontWeight: 600, minWidth: 110 }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ color: '#0f172a' }}>
        {value ?? '—'}
      </Typography>
    </Stack>
  );
}

export default function AdminUserDetailDialog({ open, user, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết người dùng</DialogTitle>
      <DialogContent>
        <Stack
          alignItems="center"
          direction="column"
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Avatar
            src={user?.avatarUrl}
            sx={{ width: 48, height: 48, bgcolor: '#22c55e' }}
          >
            {user?.fullName?.[0] || user?.name?.[0] || user?.email?.[0] || '?'}
          </Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.fullName || user?.name || 'Người dùng'}
          </Typography>
        </Stack>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <DetailRow label="ID" value={user?.id ?? '—'} />
          <DetailRow
            label="Họ và tên"
            value={user?.fullName || user?.name || '—'}
          />
          <DetailRow label="Email" value={user?.email || '—'} />
          <DetailRow label="Điện thoại" value={user?.phone || '—'} />
          <DetailRow label="Vai trò" value={user?.role || '—'} />
          <DetailRow
            label="Trạng thái"
            value={user?.isActive ? 'Hoạt động' : 'Đã khóa'}
          />
          <DetailRow label="Số booking" value={user?.bookingCount ?? '—'} />
          <DetailRow
            label="Số sân đã đặt"
            value={user?.bookedCourtCount ?? '—'}
          />
          <DetailRow label="Ngày tạo" value={formatDate(user?.createdAt)} />
          <DetailRow
            label="Cập nhật lần cuối"
            value={formatDate(user?.updatedAt)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
