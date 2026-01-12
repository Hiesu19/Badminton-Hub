import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { SidebarPage } from '@booking/shared';
import { sidebarItemsOwner } from '@booking/shared/const/sidebarItems.js';
import { fetchOwnerImages } from '../services/ownerImageService.js';
import { getMyCourt } from '../services/ownerCourtService.js';
import OwnerGalleryUploadDialog from '../components/OwnerGalleryUploadDialog.jsx';

export default function OwnerGalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [supperCourtId, setSupperCourtId] = useState(null);

  useEffect(() => {
    syncUserFromStorage();
    loadCourt();
    loadImages();
  }, []);

  const loadCourt = async () => {
    try {
      const data = await getMyCourt();
      setSupperCourtId(data?.id ?? null);
    } catch (err) {
      console.error(err);
    }
  };

  const syncUserFromStorage = () => {
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        setCurrentUser(JSON.parse(rawUser));
      }
    } catch {
      setCurrentUser(null);
    }
  };

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await fetchOwnerImages();
      setImages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sidebarUser = currentUser
    ? {
        name:
          currentUser.fullName ||
          currentUser.name ||
          currentUser.email ||
          'Chủ sân',
        role: currentUser.role || 'owner',
        avatarUrl: currentUser.avatarUrl,
      }
    : {
        name: 'Chủ sân',
        role: 'owner',
      };

  return (
    <SidebarPage
      user={sidebarUser}
      items={sidebarItemsOwner}
      canOpenProfile={!!currentUser}
      appBarTitle="Hình ảnh"
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 0 },
          py: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f3f2b' }}>
            Quản lý hình ảnh
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: 'none' }}
            onClick={() => setUploadDialogOpen(true)}
          >
            Tải ảnh mới
          </Button>
        </Box>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Thư viện hiện tại
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Ảnh</TableCell>
                      <TableCell>Loại</TableCell>
                      <TableCell>Ưu tiên</TableCell>
                      <TableCell>Ngày tạo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {images.map((image) => (
                      <TableRow key={image.id ?? image.key}>
                        <TableCell>{image.id ?? '—'}</TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Avatar
                              variant="rounded"
                              src={image.url}
                              sx={{ width: 40, height: 40 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ wordBreak: 'break-all' }}
                            >
                              {image.key}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip label={image.type || 'gallery'} size="small" />
                        </TableCell>
                        <TableCell>{image.priority ?? 0}</TableCell>
                        <TableCell>
                          {image.createdAt
                            ? new Date(image.createdAt).toLocaleString('vi-VN')
                            : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {images.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Chưa có ảnh nào.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        <OwnerGalleryUploadDialog
          open={uploadDialogOpen}
          onClose={() => {
            setUploadDialogOpen(false);
            loadImages();
          }}
          supperCourtId={supperCourtId}
        />
      </Box>
    </SidebarPage>
  );
}
