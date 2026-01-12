import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MapView from '../components/MapView.jsx';
import ClientSidebarLayout from '../components/ClientSidebarLayout.jsx';
import CourtInfoPanel from '../components/CourtInfoPanel.jsx';
import {
  fetchAllPublicCourts,
  fetchPublicCourts,
  fetchPublicCourtDetail,
  fetchPublicCourtPriceMatrix,
} from '../services/publicCourtsService.js';

export default function ClientMapsPage() {
  const [mapCourts, setMapCourts] = useState([]);
  const [searchCourts, setSearchCourts] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [priceMatrix, setPriceMatrix] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(null);

  useEffect(() => {
    loadAllCourtsForMap();
    loadSearchCourts('');
    detectCurrentLocation();
  }, []);

  useEffect(() => {
    loadSearchCourts(searchTerm);
  }, [searchTerm]);

  /**
   * Gọi API isAll=true để lấy toàn bộ sân cho bản đồ.
   */
  const loadAllCourtsForMap = async () => {
    try {
      const mapped = await fetchAllPublicCourts();
      setMapCourts(mapped);
    } catch (error) {
      console.error('Không thể load danh sách sân công khai (map):', error);
    }
  };

  /**
   * Gọi API phân trang + search để lấy danh sách sân cho ô tìm kiếm.
   */
  const loadSearchCourts = async (term) => {
    try {
      const mapped = await fetchPublicCourts({
        page: 1,
        limit: 50,
        search: term || undefined,
      });
      setSearchCourts(mapped);
    } catch (error) {
      console.error('Không thể load danh sách sân công khai (search):', error);
    }
  };

  /**
   * Gọi API lấy chi tiết sân theo id và cập nhật panel chi tiết.
   */
  const handleSelectCourt = async (court) => {
    setFocusedLocation({
      latitude: court.latitude,
      longitude: court.longitude,
    });

    setDetailLoading(true);
    setPriceMatrix(null);
    setPriceError(null);
    setPriceLoading(false);
    try {
      const detail = await fetchPublicCourtDetail(court.id);
      setSelectedCourt(detail);
    } catch (error) {
      console.error('Không thể lấy chi tiết sân:', error);
      // Nếu lỗi, vẫn hiển thị tối thiểu dữ liệu có sẵn
      setSelectedCourt(court);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRequestPrice = async () => {
    if (!selectedCourt) {
      return;
    }
    setPriceLoading(true);
    setPriceError(null);
    try {
      const matrix = await fetchPublicCourtPriceMatrix(selectedCourt.id);
      setPriceMatrix(matrix);
    } catch (error) {
      console.error('Không thể lấy bảng giá sân:', error);
      setPriceError('Không thể tải bảng giá lúc này.');
    } finally {
      setPriceLoading(false);
    }
  };

  const detectCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.error('Không thể lấy vị trí hiện tại:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  return (
    <ClientSidebarLayout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        {/* Cột thông tin & tìm kiếm */}
        <Box
          sx={{
            flex: { xs: '0 0 auto', md: 1 },
            minWidth: { xs: '100%', md: 260 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: { xs: 360, md: 'calc(100vh - 200px)' },
          }}
        >
          <CourtInfoPanel
            court={selectedCourt}
            loading={detailLoading}
            priceMatrix={priceMatrix}
            priceLoading={priceLoading}
            priceError={priceError}
            onRequestPrice={handleRequestPrice}
          />

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                bgcolor: '#f1f5f9',
                borderRadius: 3,
                p: 2,
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px rgba(15, 46, 36, 0.08)',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: '#0f172a' }}
              >
                Tìm sân ưa thích
              </Typography>
              <Typography variant="body2" sx={{ color: '#475467' }}>
                Gõ tên sân hoặc quận để lọc nhanh.
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="VD: Sân Cầu Lông 41 Phương Liệt"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mt: 1 }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ color: '#94a3b8', mr: 1 }} />
                  ),
                  sx: { borderRadius: 999, bgcolor: '#ffffff' },
                }}
              />
            </Box>

            <Divider sx={{ borderColor: '#e5e7eb' }} />

            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                minHeight: 0,
              }}
            >
              {searchCourts.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Không tìm thấy sân phù hợp.
                </Typography>
              ) : (
                <List dense disablePadding>
                  {searchCourts.map((court) => (
                    <ListItem
                      key={court.id}
                      component="button"
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        '&:hover': {
                          bgcolor: '#f3f4f6',
                        },
                      }}
                      onClick={() => handleSelectCourt(court)}
                    >
                      <ListItemText
                        primary={court.name}
                        secondary={`Lat: ${court.latitude}, Lng: ${court.longitude}`}
                        primaryTypographyProps={{
                          fontWeight: 600,
                        }}
                        secondaryTypographyProps={{
                          fontSize: 12,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        </Box>

        {/* Cột bản đồ: chiếm 2/3 chiều rộng trên desktop, nằm bên phải */}
        <Box
          sx={{
            flex: { xs: '0 0 auto', md: 2 },
            minWidth: 0,
            height: { xs: 360, md: 'calc(100vh - 200px)' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography sx={{ fontWeight: 700, color: '#052e16', mb: 1 }}>
            Bản đồ các sân cầu lông
          </Typography>
          <Typography variant="body2" sx={{ color: '#4b5563', mb: 2 }}>
            Xem vị trí các sân cầu lông xung quanh bạn trên bản đồ, nhấn vào
            từng điểm để xem tên sân.
          </Typography>
          <Box sx={{ flexGrow: 1, mt: 1 }}>
            <MapView
              courts={mapCourts}
              currentLocation={currentLocation}
              focusLocation={focusedLocation}
              onSelectCourt={setSelectedCourt}
            />
          </Box>
        </Box>
      </Box>
    </ClientSidebarLayout>
  );
}
