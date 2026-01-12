import {
  Box,
  Typography,
  Link,
  Chip,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import CourtImageCarousel from './CourtImageCarousel.jsx';

const DAY_LABELS = {
  0: 'Chủ nhật',
  1: 'Thứ 2',
  2: 'Thứ 3',
  3: 'Thứ 4',
  4: 'Thứ 5',
  5: 'Thứ 6',
  6: 'Thứ 7',
};

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const aliasDayMap = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0,
};

const normalizeDayKey = (rawKey) => {
  if (rawKey === undefined || rawKey === null) {
    return null;
  }
  if (typeof rawKey === 'number') {
    return rawKey;
  }
  if (/^\d+$/.test(rawKey)) {
    return Number(rawKey);
  }
  const upper = rawKey.toString().toUpperCase();
  return aliasDayMap[upper] ?? null;
};

const groupSlots = (slots = []) => {
  if (!slots.length) {
    return [];
  }
  const sorted = [...slots].sort((a, b) => {
    if (!a.startTime || !b.startTime) {
      return 0;
    }
    return a.startTime.localeCompare(b.startTime);
  });
  const segments = [];
  let current = {
    price: sorted[0].price,
    startTime: sorted[0].startTime,
    endTime: sorted[0].endTime,
  };
  for (let i = 1; i < sorted.length; i += 1) {
    const slot = sorted[i];
    if (slot.price === current.price) {
      current.endTime = slot.endTime;
    } else {
      segments.push({ ...current });
      current = {
        price: slot.price,
        startTime: slot.startTime,
        endTime: slot.endTime,
      };
    }
  }
  segments.push({ ...current });
  return segments;
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'Chưa rõ';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const formatTimeRange = (start, end) => {
  if (!start || !end) return 'Không xác định';
  return `${start} - ${end}`;
};

const buildNormalizedMatrix = (matrix) => {
  if (!matrix) return {};
  const normalized = {};
  Object.entries(matrix).forEach(([key, slots]) => {
    const normalizedKey = normalizeDayKey(key);
    if (normalizedKey === null) {
      return;
    }
    normalized[normalizedKey] = slots ?? [];
  });
  return normalized;
};

/**
 * Panel thông tin chi tiết của sân được chọn, hiển thị ngay phía trái bản đồ.
 */
export default function CourtInfoPanel({
  court,
  loading,
  priceMatrix,
  priceLoading,
  priceError,
  onRequestPrice,
}) {
  const hasCourt = Boolean(court) && !loading;
  const rating =
    typeof court?.rating === 'number' ? court.rating.toFixed(1) : '4.9';
  const imageUrl =
    court?.imageUrl ??
    'https://image.kkday.com/v2/image/get/w_960,c_fit,q_55,wm_auto/s1.kkday.com/product_114032/20250611175426_6HEGI/png';

  const [tabIndex, setTabIndex] = useState(0);
  const [priceDayIndex, setPriceDayIndex] = useState(0);
  const normalizedMatrix = buildNormalizedMatrix(priceMatrix);
  const activePriceDay = DAY_ORDER[priceDayIndex] ?? DAY_ORDER[0];
  const activeSlots = normalizedMatrix[activePriceDay] ?? [];

  useEffect(() => {
    setTabIndex(0);
    setPriceDayIndex(0);
  }, [court?.id]);

  const handleTabChange = (_, value) => {
    setTabIndex(value);
    if (value === 1) {
      setPriceDayIndex(0);
      if (!priceLoading && !priceMatrix && !priceError) {
        onRequestPrice?.();
      }
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        borderRadius: 3,
        boxShadow: '0 20px 60px rgba(15, 46, 36, 0.08)',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt={court?.name ?? 'Ảnh sân cầu lông'}
        sx={{
          width: '100%',
          height: 140,
          objectFit: 'cover',
          borderRadius: 2,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ fontWeight: 700, color: '#059669' }}
          >
            Chi tiết sân
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#061a13',
              mt: 0.5,
            }}
          >
            {hasCourt ? court.name : 'Chọn một sân trên bản đồ để xem chi tiết'}
          </Typography>
        </Box>
        <Box>
          <Chip
            label={hasCourt ? 'Đang xem' : 'Chưa chọn'}
            color={hasCourt ? 'success' : 'default'}
            size="small"
          />
        </Box>
      </Box>

      <Typography variant="body2" sx={{ color: '#374151', minHeight: 44 }}>
        {loading
          ? 'Đang tải chi tiết sân...'
          : court?.description ??
            'Thông tin chi tiết sẽ hiển thị khi bạn chọn một sân trong danh sách hoặc trên marker.'}
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mt: 2 }}
        disabled={!hasCourt}
      >
        <Tab label="Thông tin" value={0} />
        <Tab label="Bảng giá" value={1} />
        <Tab label="Ảnh" value={2} />
      </Tabs>

      <Box
        hidden={tabIndex !== 0}
        sx={{
          display: tabIndex === 0 ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 1.5,
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: '#111827' }}
          >
            ⭐ {rating}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            {court?.reviewCount
              ? `${court.reviewCount} đánh giá`
              : 'Chưa có đánh giá'}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#e5e7eb' }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography variant="body2" sx={{ color: '#374151' }}>
            <Box component="span" sx={{ fontWeight: 700 }}>
              Địa chỉ:{' '}
            </Box>
            {court?.address ?? 'Chưa cập nhật'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#374151' }}>
            <Box component="span" sx={{ fontWeight: 700 }}>
              Giờ hoạt động:{' '}
            </Box>
            {court?.openingHours ?? '05:00 - 24:00'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#374151' }}>
            <Box component="span" sx={{ fontWeight: 700 }}>
              Liên hệ:{' '}
            </Box>
            {court?.phone ?? 'Chưa cập nhật'}
          </Typography>
        </Box>

        {court?.website && (
          <Link
            href={court.website}
            target="_blank"
            rel="noreferrer"
            sx={{ color: '#1d4ed8', fontWeight: 600 }}
          >
            Link đặt sân online
          </Link>
        )}

        {court?.addressLink && (
          <Link
            href={court.addressLink}
            target="_blank"
            rel="noreferrer"
            sx={{ color: '#1d4ed8', fontWeight: 600 }}
          >
            Xem vị trí trên bản đồ
          </Link>
        )}
      </Box>

      <Box
        hidden={tabIndex !== 1}
        sx={{
          display: tabIndex === 1 ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 1.5,
          mt: 2,
        }}
      >
        <Divider sx={{ borderColor: '#e5e7eb' }} />

        {priceLoading ? (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <CircularProgress size={18} />
            <Typography variant="body2" sx={{ color: '#475467' }}>
              Đang tải bảng giá...
            </Typography>
          </Box>
        ) : priceError ? (
          <Typography variant="body2" sx={{ color: '#b91c1c' }}>
            {priceError}
          </Typography>
        ) : Object.keys(normalizedMatrix).length === 0 ? (
          <Typography variant="body2" sx={{ color: '#475467' }}>
            Chưa có dữ liệu giá cho sân này.
          </Typography>
        ) : (
          <>
            <Tabs
              value={priceDayIndex}
              onChange={(_, value) => setPriceDayIndex(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mt: 1 }}
              aria-label="Ngày trong tuần"
            >
              {DAY_ORDER.map((day) => (
                <Tab key={day} label={DAY_LABELS[day] ?? 'Không rõ'} />
              ))}
            </Tabs>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {activeSlots.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#475467' }}>
                  {DAY_LABELS[activePriceDay] ?? 'Ngày này'} chưa có dữ liệu
                </Typography>
              ) : (
                groupSlots(activeSlots).map((segment) => (
                  <Box
                    key={segment.startTime + segment.endTime + segment.price}
                    sx={{ pt: 0.5 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: '#475467', fontWeight: 600 }}
                    >
                      {formatTimeRange(segment.startTime, segment.endTime)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#0f766e' }}>
                      Giá: {formatCurrency(segment.price / 2)} đ / 30 phút
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          </>
        )}
      </Box>

      <Box
        hidden={tabIndex !== 2}
        sx={{
          display: tabIndex === 2 ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 1.5,
          mt: 2,
        }}
      >
        {court ? (
          <CourtImageCarousel courtId={court.id} />
        ) : (
          <Typography variant="body2" sx={{ color: '#475467' }}>
            Chọn sân để xem gallery ảnh.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
