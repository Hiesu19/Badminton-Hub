import { useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from 'react-leaflet';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Icon màu xanh lá cho sân
const courtIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'court-marker-icon',
});

// Icon màu đỏ cho vị trí hiện tại
const currentLocationIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'current-location-marker-icon',
});

/**
 * Component con dùng để recenter map khi focusLocation thay đổi.
 */
function RecenterOnCourt({ focusLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!focusLocation) return;
    map.setView(
      [focusLocation.latitude, focusLocation.longitude],
      map.getZoom(),
      { animate: true },
    );
  }, [focusLocation, map]);

  return null;
}

/**
 * Component bản đồ hiển thị danh sách sân cầu lông + vị trí hiện tại của người dùng (nếu có).
 *
 * @param {object} props
 * @param {{ id: string|number, name: string, latitude: number, longitude: number, address?: string, phone?: string, email?: string, website?: string }[]} props.courts
 * @param {{ latitude: number, longitude: number } | null} [props.currentLocation]
 * @param {{ latitude: number, longitude: number } | null} [props.focusLocation] - toạ độ sân được chọn từ ô tìm kiếm
 * @param {(court: any) => void} [props.onSelectCourt] - callback khi nhấn nút Chi tiết trên marker
 */
export default function MapView({
  courts,
  currentLocation,
  focusLocation,
  onSelectCourt,
}) {
  const navigate = useNavigate();
  const markers = courts ?? [];

  const center = useMemo(() => {
    if (currentLocation) {
      return [currentLocation.latitude, currentLocation.longitude];
    }
    if (markers.length > 0) {
      return [markers[0].latitude, markers[0].longitude];
    }
    return [21.005, 105.843];
  }, [markers, currentLocation]);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
      >
        <RecenterOnCourt focusLocation={focusLocation} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {markers.map((court) => (
          <Marker
            key={court.id}
            position={[court.latitude, court.longitude]}
            icon={courtIcon}
          >
            <Popup>
              <strong>{court.name}</strong>
              <br />
              Tọa độ: {court.latitude}, {court.longitude}
              <br />
              <Button
                size="small"
                variant="outlined"
                sx={{
                  mt: 1,
                  textTransform: 'none',
                  fontSize: 12,
                  borderRadius: 999,
                  mr: 1,
                  borderColor: '#e5e7eb',
                }}
                onClick={() => onSelectCourt && onSelectCourt(court)}
              >
                Chi tiết
              </Button>
              <Button
                size="small"
                variant="contained"
                sx={{
                  mt: 1,
                  textTransform: 'none',
                  fontSize: 12,
                  borderRadius: 999,
                  bgcolor: '#22c55e',
                  '&:hover': { bgcolor: '#16a34a' },
                }}
                onClick={() => navigate(`/book?courtId=${court.id}`)}
              >
                Đặt sân
              </Button>
            </Popup>
            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
              <strong>{court.name}</strong>
            </Tooltip>
          </Marker>
        ))}

        {currentLocation && (
          <Marker
            position={[currentLocation.latitude, currentLocation.longitude]}
            icon={currentLocationIcon}
          >
            <Popup>
              <strong>Vị trí của bạn</strong>
              <br />
              Tọa độ: {currentLocation.latitude}, {currentLocation.longitude}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
