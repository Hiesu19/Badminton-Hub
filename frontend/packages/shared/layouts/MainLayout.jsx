import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Toaster } from 'react-hot-toast';

const drawerWidth = 260;

const COLORS = {
  pageBg: '#f5f8f5',
  sidebarBg: '#e3f4df',
  sidebarBorder: '#d0e4cf',
  sidebarHeaderBg: '#d6f0d1',
  sidebarText: '#2f5d3b',
  appBarBorder: '#e0e7e4',
  contentBg: '#f9fbf8',
};

export default function MainLayout({ sidebar, children, appBarTitle = '' }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawerContent = (
    <>
      <Toolbar
        sx={{
          minHeight: 64,
          px: 2.5,
          borderBottom: `1px solid ${COLORS.sidebarBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          bgcolor: COLORS.sidebarHeaderBg,
        }}
      >
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 700,
            color: COLORS.sidebarText,
          }}
        >
          Badminton Hub
        </Typography>
      </Toolbar>
      <Box sx={{ p: 2, overflowY: 'auto', height: '100%' }}>{sidebar}</Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: COLORS.pageBg }}>
      <CssBaseline />
      <Toaster position="top-right" />

      {/* Sidebar desktop - Permanent */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: COLORS.sidebarBg,
            borderRight: `1px solid ${COLORS.sidebarBorder}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Sidebar mobile - Temporary */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleToggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: COLORS.sidebarBg,
            borderRight: `1px solid ${COLORS.sidebarBorder}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Khu vực nội dung chính */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#ffffff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: '#ffffff',
            borderBottom: `1px solid ${COLORS.appBarBorder}`,
            color: COLORS.sidebarText,
          }}
        >
          <Toolbar
            sx={{
              minHeight: 64,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Nút mở sidebar trên mobile */}
              {isMobile && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleToggleDrawer}
                >
                  <Typography component="span" sx={{ fontSize: 22 }}>
                    ☰
                  </Typography>
                </IconButton>
              )}

              {appBarTitle && (
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {appBarTitle}
                </Typography>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: COLORS.contentBg,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
