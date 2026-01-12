import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { sidebarItemsOwner } from '@booking/shared/const/sidebarItems.js';
import { SidebarPage } from '@booking/shared';
import toast from 'react-hot-toast';
import {
  fetchSubCourts,
  createSubCourt,
  updateSubCourt,
  deleteSubCourt,
} from '../services/subCourtsService.js';

export default function SubCourtsPage() {
  const [subCourts, setSubCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', isActive: true });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    syncUserFromStorage();
    loadSubCourts();
  }, []);

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

  const loadSubCourts = async () => {
    try {
      setLoading(true);
      const data = await fetchSubCourts();
      setSubCourts(data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Không thể tải danh sách sân con. Vui lòng thử lại.';
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || '',
      isActive: item.isActive ?? true,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên sân con');
      return;
    }
    try {
      setSubmitting(true);
      if (editing) {
        await updateSubCourt(editing.id, form);
        toast.success('Cập nhật sân con thành công');
      } else {
        await createSubCourt(form);
        toast.success('Thêm sân con thành công');
      }
      setDialogOpen(false);
      loadSubCourts();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        'Không thể lưu sân con. Vui lòng thử lại.';
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    try {
      setDeleting(true);
      await deleteSubCourt(editing.id);
      toast.success('Xóa sân con thành công');
      setDeleteDialogOpen(false);
      setEditing(null);
      loadSubCourts();
    } catch (err) {
      toast.error('Không thể xóa sân con. Vui lòng thử lại.');
    } finally {
      setDeleting(false);
    }
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
            mb: 2.5,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#052e16' }}>
              Quản lý sân con
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Thêm, chỉnh sửa hoặc xóa các sân con trong cụm sân của bạn.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            sx={{
              bgcolor: '#22c55e',
              '&:hover': { bgcolor: '#16a34a' },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Thêm sân con
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : subCourts.length === 0 ? (
          <Card>
            <CardContent>
              <Typography textAlign="center" color="text.secondary" py={4}>
                Chưa có sân con nào. Nhấn "Thêm sân con" để bắt đầu.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Card}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f8f5' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Tên sân con</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subCourts.map((court) => (
                  <TableRow key={court.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {court.name || '—'}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          color: court.isActive ? '#166534' : '#9ca3af',
                          fontWeight: 600,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: court.isActive ? '#22c55e' : '#d1d5db',
                          }}
                        />
                        {court.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => openEdit(court)}
                        sx={{ color: '#16a34a' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditing(court);
                          setDeleteDialogOpen(true);
                        }}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Dialog thêm / sửa sân con */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 700, color: '#1f3f2b' }}>
            {editing ? 'Chỉnh sửa sân con' : 'Thêm sân con'}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
            >
              <TextField
                label="Tên sân con"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                fullWidth
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ minWidth: 90 }}>
                  Trạng thái:
                </Typography>
                <Button
                  variant={form.isActive ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setForm({ ...form, isActive: true })}
                  sx={{
                    bgcolor: form.isActive ? '#22c55e' : 'transparent',
                    color: form.isActive ? '#fff' : '#166534',
                    '&:hover': {
                      bgcolor: form.isActive ? '#16a34a' : '#ecfdf3',
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Đang hoạt động
                </Button>
                <Button
                  variant={!form.isActive ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setForm({ ...form, isActive: false })}
                  sx={{
                    bgcolor: !form.isActive ? '#ef4444' : 'transparent',
                    color: !form.isActive ? '#fff' : '#b91c1c',
                    '&:hover': {
                      bgcolor: !form.isActive ? '#dc2626' : '#fee2e2',
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Ngừng hoạt động
                </Button>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)} disabled={submitting}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ bgcolor: '#22c55e', '&:hover': { bgcolor: '#16a34a' } }}
            >
              {submitting ? <CircularProgress size={20} /> : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1f3f2b' }}>
          Xóa sân con
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc muốn xóa sân con{' '}
            <strong>{editing?.name || 'này'}</strong>? Hành động không thể hoàn
            tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            disabled={deleting}
            sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
          >
            {deleting ? <CircularProgress size={20} /> : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </SidebarPage>
  );
}
