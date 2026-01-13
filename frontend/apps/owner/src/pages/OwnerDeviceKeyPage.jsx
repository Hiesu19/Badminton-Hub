import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { SidebarPage } from '@booking/shared';
import { sidebarItemsOwner } from '@booking/shared/const/sidebarItems.js';
import {
  fetchOwnerDeviceKey,
  regenerateOwnerDeviceKey,
} from '../services/ownerDeviceKeyService.js';

const STATE_IDLE = 'idle';
const STATE_ERROR = 'error';
const STATE_SUCCESS = 'success';

export default function OwnerDeviceKeyPage() {
  const [sidebarUser, setSidebarUser] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      setSidebarUser({
        name: parsed?.fullName || parsed?.name || parsed?.email || 'Chủ sân',
        role: parsed?.role || 'owner',
        avatarUrl: parsed?.avatarUrl,
      });
    } catch {
      setSidebarUser(null);
    }
  }, []);

  return (
    <SidebarPage items={sidebarItemsOwner} user={sidebarUser} canOpenProfile>
      <DeviceKeyContent />
    </SidebarPage>
  );
}

function DeviceKeyContent() {
  const [deviceKey, setDeviceKey] = useState('');
  const [supperCourtId, setSupperCourtId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState(STATE_IDLE);
  const [message, setMessage] = useState('');

  const loadKey = async () => {
    setLoading(true);
    setStatus(STATE_IDLE);
    setMessage('');
    try {
      const response = await fetchOwnerDeviceKey();
      const payload = response.data?.data ?? response.data;
      setDeviceKey(payload?.deviceKey ?? '');
      setSupperCourtId(payload?.supperCourtId ?? null);
    } catch (error) {
      setStatus(STATE_ERROR);
      setMessage(
        error?.response?.data?.message ||
          'Không tải được device key, vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKey();
  }, []);

  const handleRegenerate = async () => {
    setRefreshing(true);
    setStatus(STATE_IDLE);
    setMessage('');
    try {
      const response = await regenerateOwnerDeviceKey();
      const payload = response.data?.data ?? response.data;
      setDeviceKey(payload?.deviceKey ?? '');
      setStatus(STATE_SUCCESS);
      setMessage('Đã tạo key mới thành công.');
    } catch (error) {
      setStatus(STATE_ERROR);
      setMessage(
        error?.response?.data?.message ||
          'Không thể tạo key mới, vui lòng thử lại.',
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopy = async () => {
    if (!deviceKey) return;
    try {
      await navigator.clipboard.writeText(deviceKey);
      setStatus(STATE_SUCCESS);
      setMessage('Đã sao chép key vào clipboard.');
    } catch (error) {
      setStatus(STATE_ERROR);
      setMessage(
        'Trình duyệt không cho phép sao chép. Vui lòng sao chép thủ công.',
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100%',
        py: 4,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 640 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Key thiết bị MQTT
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sử dụng key này để thiết lập kết nối IoT giữa thiết bị và hệ thống.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Stack spacing={1}>
                <Typography variant="subtitle2" component="div">
                  Supper court ID
                </Typography>
                <Typography variant="body1">{supperCourtId ?? '—'}</Typography>
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mt: 3 }}
              >
                <Box
                  sx={{
                    flex: 1,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  {deviceKey || 'Chưa có key'}
                </Box>
                <IconButton
                  aria-label="copy device key"
                  onClick={handleCopy}
                  disabled={!deviceKey}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Stack>
            </>
          )}

          {status !== STATE_IDLE && message && (
            <Alert
              severity={status === STATE_ERROR ? 'error' : 'success'}
              sx={{ mt: 3 }}
            >
              {message}
            </Alert>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', gap: 2, px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={loadKey}
            disabled={loading || refreshing}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            onClick={handleRegenerate}
            disabled={loading || refreshing}
          >
            {refreshing ? (
              <CircularProgress size={18} sx={{ color: 'white' }} />
            ) : (
              'Tạo key mới'
            )}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
