import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import BusinessIcon from '@mui/icons-material/Business';

export const sidebarItemsClient = [
  { text: 'Trang chủ', icon: HomeIcon, path: '/' },
  { text: 'Map View', icon: DashboardIcon, path: '/maps' },
  { text: 'Đặt sân', icon: DashboardIcon, path: '/book' },
  { text: 'Lịch sử đặt sân', icon: RequestPageIcon, path: '/history' },
];

export const sidebarItemsOwner = [
  { text: 'Trang chủ', icon: HomeIcon, path: '/' },
  { text: 'Quản lý sân', icon: BusinessIcon, path: '/courts' },
  { text: 'Quản lý các sân con', icon: DashboardIcon, path: '/sub-courts' },
  { text: 'Quản lý đặt sân', icon: DashboardIcon, path: '/bookings' },
];

export const sidebarItemsAdmin = [
  { text: 'Trang chủ', icon: HomeIcon, path: '/' },
  { text: 'Quản lý hệ thống', icon: DashboardIcon, path: '/admin' },
];
