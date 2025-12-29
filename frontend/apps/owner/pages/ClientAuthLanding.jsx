import { useState } from 'react';
import { Box, Button, Typography, Chip, Stack } from '@mui/material';
import { MainLayout, AuthLoginForm, AuthRegisterForm } from '@booking/shared';
import '../App.css';

/**
 * Trang landing + Auth dành cho khách chơi (client site).
 * - Dùng MainLayout với sidebar giới thiệu tính năng.
 * - Bên phải là form Đăng nhập / Đăng ký có thể chuyển đổi.
 */
export default function ClientAuthLanding() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  const sidebar = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{ textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}
      >
        Dành cho khách chơi
      </Typography>

      <Stack component="nav" spacing={1.2}>
        <Box>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, color: '#14532d', mb: 0.3 }}
          >
            Trang chủ
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Khám phá sân cầu lông gần bạn
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, color: '#14532d', mb: 0.3 }}
          >
            Đặt sân nhanh
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Chọn giờ, chọn sân, xác nhận trong vài bước
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, color: '#14532d', mb: 0.3 }}
          >
            Lịch sử đặt sân
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Theo dõi các lượt đặt và thanh toán của bạn
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Typography
          variant="caption"
          sx={{ color: '#9ca3af', fontStyle: 'italic' }}
        >
          Sau khi đăng nhập, bạn sẽ thấy nhiều tính năng chi tiết hơn trong
          sidebar này.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <MainLayout sidebar={sidebar}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 4, md: 6 },
          py: { xs: 2, md: 4 },
        }}
      >
        {/* Khối giới thiệu bên trái */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Chip
            label="Nền tảng đặt sân cầu lông cho cộng đồng"
            sx={{
              alignSelf: 'flex-start',
              bgcolor: '#dcfce7',
              color: '#166534',
              fontWeight: 600,
            }}
          />

          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: '#052e16',
                fontSize: { xs: 30, md: 36 },
                lineHeight: 1.2,
                mb: 1.5,
              }}
            >
              Badminton Hub – Đặt sân dễ dàng,
              <br />
              chơi hết mình cùng bạn bè.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#4b5563',
                maxWidth: 480,
              }}
            >
              Tìm kiếm sân phù hợp, giữ chỗ nhanh chóng và quản lý lịch chơi của
              bạn trong một nền tảng duy nhất. Tập trung vào trận đấu, còn lại
              để Badminton Hub lo.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
            <Chip
              label="Đặt sân theo giờ linh hoạt"
              sx={{ bgcolor: '#ecfdf3', color: '#15803d' }}
            />
            <Chip
              label="Theo dõi lịch sử & thanh toán"
              sx={{ bgcolor: '#eff6ff', color: '#1d4ed8' }}
            />
            <Chip
              label="Kết nối chủ sân & người chơi"
              sx={{ bgcolor: '#fef3c7', color: '#92400e' }}
            />
          </Stack>
        </Box>

        {/* Khối Auth bên phải */}
        <Box
          sx={{
            flex: 1,
            maxWidth: 520,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mb: 2.5,
            }}
          >
            <Button
              variant={mode === 'login' ? 'contained' : 'text'}
              onClick={() => setMode('login')}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: mode === 'login' ? '#22c55e' : 'transparent',
                color: mode === 'login' ? '#ffffff' : '#374151',
                '&:hover': {
                  bgcolor: mode === 'login' ? '#16a34a' : '#f3f4f6',
                },
              }}
            >
              Đăng nhập
            </Button>
            <Button
              variant={mode === 'register' ? 'contained' : 'text'}
              onClick={() => setMode('register')}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: mode === 'register' ? '#22c55e' : 'transparent',
                color: mode === 'register' ? '#ffffff' : '#374151',
                '&:hover': {
                  bgcolor: mode === 'register' ? '#16a34a' : '#f3f4f6',
                },
              }}
            >
              Đăng ký
            </Button>
          </Box>

          {mode === 'login' ? (
            <AuthLoginForm site="client" title="Đăng nhập Badminton Hub" />
          ) : (
            <AuthRegisterForm title="Tạo tài khoản Badminton Hub" />
          )}
        </Box>
      </Box>
    </MainLayout>
  );
}


