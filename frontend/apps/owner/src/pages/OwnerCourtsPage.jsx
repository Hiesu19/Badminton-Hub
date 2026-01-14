import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { SidebarPage } from '@booking/shared';
import { sidebarItemsOwner } from '@booking/shared/const/sidebarItems.js';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import { getMyCourt } from '../services/ownerCourtService.js';
import EditCourtDialog from '../components/EditCourtDialog.jsx';
import PriceManagement from '../components/PriceManagement.jsx';
import RegisterCourtSection from '../components/RegisterCourtSection.jsx';
import toast from 'react-hot-toast';
import OwnerGalleryUploadDialog from '../components/OwnerGalleryUploadDialog.jsx';

/**
 * Trang quản lý sân cho owner
 */
export default function OwnerCourtsPage() {
  const [courtData, setCourtData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [courtNotFound, setCourtNotFound] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);

  useEffect(() => {
    syncUserFromStorage();
    loadCourtData();
  }, []);

  const syncUserFromStorage = () => {
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        setCurrentUser(parsed);
      }
    } catch {
      setCurrentUser(null);
    }
  };

  const loadCourtData = async () => {
    try {
      setLoading(true);
      const data = await getMyCourt();
      setCourtData(data);
      setCourtNotFound(false);
    } catch (err) {
      if (err?.response?.status === 404) {
        setCourtData(null);
        setCourtNotFound(true);
      } else {
        const message =
          err?.response?.data?.message ||
          'Không thể tải thông tin cụm sân. Vui lòng thử lại.';
        toast.error(Array.isArray(message) ? message.join(', ') : message);
        setCourtNotFound(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = () => {
    loadCourtData();
    toast.success('Cập nhật thông tin cụm sân thành công');
  };

  const sidebarItems = sidebarItemsOwner;
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
      items={sidebarItems}
      canOpenProfile={!!currentUser}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f3f2b' }}>
            Quản lý cụm sân
          </Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditDialogOpen(true)}
            disabled={!courtData}
            sx={{
              bgcolor: '#22c55e',
              '&:hover': { bgcolor: '#16a34a' },
            }}
          >
            Chỉnh sửa thông tin
          </Button>
          <Button
            variant="outlined"
            sx={{ textTransform: 'none', borderColor: '#22c55e', color: '#166534' }}
            onClick={() => setGalleryDialogOpen(true)}
            disabled={!courtData}
          >
            Thêm ảnh gallery
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : courtData ? (
          <Stack spacing={3}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 18px 35px rgba(15, 46, 36, 0.12)',
                overflow: 'hidden',
              }}
            >
              <CardContent
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 0.5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: '#6b7280', letterSpacing: 1 }}
                    >
                      CỤM SÂN CỦA BẠN
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: '#052e16' }}
                    >
                      {courtData.name || 'Chưa đặt tên cụm sân'}
                    </Typography>
                  </Box>
                  <Chip
                    label={courtData.status == "active" ? "Đang hoạt động" : "Tạm ngưng hoạt động"}
                    size="small"
                    sx={{
                      bgcolor: courtData.status == "active" ? '#dcfce7' : '#fee2e2',
                      color: courtData.status == "active" ? '#15803d' : '#b91c1c',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {courtData.imageUrl && (
                  <Box
                    component="img"
                    src={courtData.imageUrl}
                    alt={courtData.name}
                    sx={{
                      width: '100%',
                      maxWidth: 640,
                      maxHeight: 320,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      display: 'block',
                      mx: 'auto',
                    }}
                  />
                )}

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    mt: courtData.imageUrl ? 0.5 : 1,
                  }}
                >
                  {courtData.address && (
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <LocationOnIcon
                        fontSize="small"
                        sx={{ mt: '2px', color: '#16a34a' }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: '#6b7280', mb: 0.25 }}
                        >
                          Địa chỉ
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {courtData.address}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {courtData.phone && (
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <PhoneIcon
                        fontSize="small"
                        sx={{ mt: '2px', color: '#16a34a' }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: '#6b7280', mb: 0.25 }}
                        >
                          Số điện thoại
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {courtData.phone}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {courtData.email && (
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <EmailIcon
                        fontSize="small"
                        sx={{ mt: '2px', color: '#16a34a' }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: '#6b7280', mb: 0.25 }}
                        >
                          Email
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {courtData.email}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {courtData.website && (
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <LanguageIcon
                        fontSize="small"
                        sx={{ mt: '2px', color: '#16a34a' }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ color: '#6b7280', mb: 0.25 }}
                        >
                          Website
                        </Typography>
                        <Typography
                          variant="body1"
                          component="a"
                          href={courtData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#16a34a',
                            textDecoration: 'none',
                            fontWeight: 500,
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {courtData.website}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            <PriceManagement />
          </Stack>
        ) : courtNotFound ? (
          <RegisterCourtSection
            onSuccess={loadCourtData}
            currentUser={currentUser}
          />
        ) : (
          <Alert severity="warning">
            Không tìm thấy thông tin cụm sân. Vui lòng liên hệ quản trị viên.
          </Alert>
        )}
      </Box>
      <OwnerGalleryUploadDialog
        open={galleryDialogOpen}
        onClose={() => setGalleryDialogOpen(false)}
        supperCourtId={courtData?.id ?? null}
      />

      <EditCourtDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        courtData={courtData}
        onSuccess={handleEditSuccess}
      />
    </SidebarPage>
  );
}
