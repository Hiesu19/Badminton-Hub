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
import MapView from '../components/MapView.jsx';
import ClientSidebarLayout from '../components/ClientSidebarLayout.jsx';
import {
    fetchAllPublicCourts,
    fetchPublicCourts,
    fetchPublicCourtDetail,
} from '../services/publicCourtsService.js';

export default function ClientMapsPage() {
    const [mapCourts, setMapCourts] = useState([]);
    const [searchCourts, setSearchCourts] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedLocation, setFocusedLocation] = useState(null);
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

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
            console.error(
                'Không thể load danh sách sân công khai (map):',
                error,
            );
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
            console.error(
                'Không thể load danh sách sân công khai (search):',
                error,
            );
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
                {/* Cột tìm kiếm: chiếm 1/3 chiều rộng trên desktop, nằm bên trái */}
                <Box
                    sx={{
                        flex: { xs: '0 0 auto', md: 1 },
                        minWidth: { xs: '100%', md: 260 },
                        bgcolor: '#ffffff',
                        borderRadius: 3,
                        boxShadow: '0 12px 40px rgba(15, 46, 36, 0.08)',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        height: { xs: 360, md: 'calc(100vh - 200px)' },
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: '#111827' }}
                    >
                        Tìm kiếm sân
                    </Typography>
                    <TextField
                        size="small"
                        placeholder="Nhập tên sân..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Divider />

                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                        }}
                    >
                        {searchCourts.length === 0 ? (
                            <Typography
                                variant="body2"
                                sx={{ color: '#6b7280' }}
                            >
                                Không tìm thấy sân phù hợp.
                            </Typography>
                        ) : (
                            <List dense disablePadding>
                                {searchCourts.map((court) => (
                                    <ListItem
                                        key={court.id}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 0.5,
                                            '&:hover': { bgcolor: '#f3f4f6' },
                                        }}
                                        button
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

                    {/* Chi tiết sân đã chọn */}
                    <Box
                        sx={{
                            mt: 2,
                            pt: 2,
                            borderTop: '1px solid #e5e7eb',
                        }}
                    >
                        {detailLoading ? (
                            <Typography
                                variant="body2"
                                sx={{ color: '#6b7280' }}
                            >
                                Đang tải chi tiết sân...
                            </Typography>
                        ) : selectedCourt ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.75,
                                }}
                            >
                                {selectedCourt.imageUrl && (
                                    <Box
                                        component="img"
                                        src={selectedCourt.imageUrl}
                                        alt={selectedCourt.name}
                                        sx={{
                                            width: '100%',
                                            maxHeight: 140,
                                            objectFit: 'cover',
                                            borderRadius: 2,
                                            mb: 1,
                                        }}
                                    />
                                )}
                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 700, color: '#111827' }}
                                >
                                    {selectedCourt.name}
                                </Typography>
                                {selectedCourt.address && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#4b5563' }}
                                    >
                                        Địa chỉ: {selectedCourt.address}
                                    </Typography>
                                )}
                                {selectedCourt.phone && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#4b5563' }}
                                    >
                                        Số điện thoại: {selectedCourt.phone}
                                    </Typography>
                                )}
                                {selectedCourt.email && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#4b5563' }}
                                    >
                                        Email: {selectedCourt.email}
                                    </Typography>
                                )}
                                {selectedCourt.website && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#2563eb' }}
                                    >
                                        Link đặt sân online:{' '}
                                        <a
                                            href={selectedCourt.website}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {selectedCourt.website}
                                        </a>
                                    </Typography>
                                )}
                                {selectedCourt.addressLink && (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#2563eb' }}
                                    >
                                        Xem vị trí trên bản đồ:{' '}
                                        <a
                                            href={selectedCourt.addressLink}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Mở bản đồ
                                        </a>
                                    </Typography>
                                )}
                            </Box>
                        ) : (
                            <Typography
                                variant="body2"
                                sx={{ color: '#9ca3af' }}
                            >
                                Chọn một sân ở danh sách bên trên hoặc bấm "Chi
                                tiết" trên marker để xem chi tiết.
                            </Typography>
                        )}
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
                    <Typography
                        sx={{ fontWeight: 700, color: '#052e16', mb: 1 }}
                    >
                        Bản đồ các sân cầu lông
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: '#4b5563', mb: 2 }}
                    >
                        Xem vị trí các sân cầu lông xung quanh bạn trên bản đồ,
                        nhấn vào từng điểm để xem tên sân.
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
