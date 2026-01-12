import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout.jsx';
import { logout } from '../services/authService.js';

export default function Sidebar({
  user,
  items,
  profilePath = '/profile',
  canOpenProfile = true,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || '?';
  const signedIn = Boolean(user && Object.keys(user).length > 0);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 2,
        height: '100%',
      }}
    >
      <Box>
        <Box
          role="button"
          tabIndex={0}
          onClick={() => {
            if (!profilePath || !canOpenProfile) return;
            navigate(profilePath);
          }}
          onKeyDown={(e) => {
            if (!profilePath || !canOpenProfile) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate(profilePath);
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 1,
            cursor: profilePath ? 'pointer' : 'default',
          }}
        >
          <Avatar
            src={user?.avatarUrl}
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#22c55e',
              fontWeight: 700,
            }}
          >
            {initial}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ fontWeight: 600, color: '#022c22' }}
            >
              {user?.name || 'Người dùng'}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#64748b', textTransform: 'capitalize' }}
              noWrap
            >
              {user?.role || 'Khách'}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <List sx={{ mt: 0.5 }}>
          {items?.map((item) => {
            const Icon = item.icon;
            const selected =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <ListItemButton
                key={item.path}
                component={NavLink}
                to={item.path}
                selected={selected}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: '#dcfce7',
                    '&:hover': { bgcolor: '#bbf7d0' },
                  },
                }}
              >
                {Icon && (
                  <ListItemIcon sx={{ minWidth: 36, color: '#166534' }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 600,
                    color: '#14532d',
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {signedIn && (
        <Box>
          <Divider sx={{ mb: 1.5 }} />
          <Button
            variant="text"
            onClick={handleLogout}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: '#b91c1c',
              fontWeight: 600,
              borderRadius: 999,
              px: 1.5,
              '&:hover': { bgcolor: '#fee2e2' },
            }}
          >
            Đăng xuất
          </Button>
        </Box>
      )}
    </Box>
  );
}

export function SidebarPage({
  user,
  items,
  profilePath,
  canOpenProfile,
  children,
}) {
  return (
    <MainLayout
      sidebar={
        <Sidebar
          user={user}
          items={items}
          profilePath={profilePath}
          canOpenProfile={canOpenProfile}
        />
      }
    >
      {children}
    </MainLayout>
  );
}
