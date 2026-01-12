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
  { text: 'Tổng quan', icon: DashboardIcon, path: '/dashboard' },
  { text: 'Quản lý sân', icon: BusinessIcon, path: '/courts' },
  { text: 'Quản lý các sân con', icon: DashboardIcon, path: '/sub-courts' },
  { text: 'Quản lý đặt sân', icon: DashboardIcon, path: '/bookings' },
  { text: 'Khoá sân', icon: BusinessIcon, path: '/lock-court' },
];

export const sidebarItemsAdmin = [
  { text: 'Trang chủ', icon: HomeIcon, path: '/' },
  { text: 'Quản lý người dùng', icon: DashboardIcon, path: '/users' },
  { text: 'Quản lý sân', icon: BusinessIcon, path: '/supper-courts' },
  { text: 'Quản lý hệ thống', icon: DashboardIcon, path: '/admin' },
];
