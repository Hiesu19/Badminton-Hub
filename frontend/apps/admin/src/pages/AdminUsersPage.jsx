import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import { SidebarPage, showErrorToast, showSuccessToast } from '@booking/shared';
import { sidebarItemsAdmin } from '@booking/shared/const/sidebarItems.js';
import {
  fetchAdminUsers,
  fetchAdminUserDetail,
  deleteAdminUser,
  createOwnerFromUser,
  fetchAdminOwnerDetail,
  updateAdminOwner,
  deleteAdminOwner,
} from '../services/adminUserService.js';
import AdminUserDetailDialog from '../components/AdminUserDetailDialog.jsx';
const ROLE_FILTERS = [
  { label: 'Tất cả', value: '' },
  { label: 'Người chơi', value: 'user' },
  { label: 'Chủ sân', value: 'owner' },
];

const defaultMeta = { page: 1, limit: 10, total: 0 };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(defaultMeta);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editOwnerId, setEditOwnerId] = useState(null);
  const [ownerForm, setOwnerForm] = useState({
    fullName: '',
    phone: '',
    isActive: true,
  });
  const [ownerDialogOpen, setOwnerDialogOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [sidebarUser, setSidebarUser] = useState(null);
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSidebarUser({
            name:
              parsed?.fullName ||
              parsed?.name ||
              parsed?.email ||
              'Người quản trị',
            role: parsed?.role || 'super_admin',
            avatarUrl: parsed?.avatarUrl,
          });
        }
      } catch {
        setSidebarUser(null);
      }
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [meta.page, roleFilter, searchTerm]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminUsers({
        page: meta.page,
        limit: meta.limit,
        role: roleFilter || undefined,
        search: searchTerm || undefined,
      });
      const payload = res.data?.data ?? [];
      setUsers(payload);
      const metadata = res.data?.metadata ?? res.data?.meta;
      if (metadata) {
        setMeta((prev) => ({ ...prev, total: metadata.total ?? prev.total }));
      }
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message ||
          'Không thể tải danh sách người dùng. Vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setMeta((prev) => ({ ...prev, page: 1 }));
    setSearchTerm(searchInput.trim());
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteAdminUser(id);
      showSuccessToast('Xóa người chơi thành công');
      loadUsers();
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message || 'Không thể xóa người chơi.',
      );
    }
  };

  const handleConvertToOwner = async (userId) => {
    try {
      await createOwnerFromUser(userId);
      showSuccessToast('Tạo owner từ user thành công');
      loadUsers();
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message || 'Không thể chuyển user thành owner.',
      );
    }
  };

  const handleOpenOwner = async (ownerId) => {
    try {
      const res = await fetchAdminOwnerDetail(ownerId);
      const owner = res.data?.data;
      setOwnerForm({
        fullName: owner?.fullName ?? '',
        phone: owner?.phone ?? '',
        isActive: owner?.isActive ?? true,
      });
      setEditOwnerId(ownerId);
      setOwnerDialogOpen(true);
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message || 'Không thể lấy thông tin owner.',
      );
    }
  };

  const handleUpdateOwner = async () => {
    try {
      await updateAdminOwner(editOwnerId, ownerForm);
      showSuccessToast('Cập nhật owner thành công');
      setOwnerDialogOpen(false);
      loadUsers();
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message || 'Không thể cập nhật owner.',
      );
    }
  };

  const handleDeleteOwner = async (ownerId) => {
    try {
      await deleteAdminOwner(ownerId);
      showSuccessToast('Xóa owner thành công');
      loadUsers();
    } catch (err) {
      showErrorToast(err?.response?.data?.message || 'Không thể xóa owner.');
    }
  };

  const handleOpenUserDetail = async (userId) => {
    try {
      const res = await fetchAdminUserDetail(userId);
      setDetailUser(res.data?.data ?? null);
      setDetailOpen(true);
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message || 'Không thể lấy thông tin người dùng.',
      );
    }
  };

  const rows = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        name: user.name || '—',
        email: user.email,
        phone: user.phone ?? '—',
        role: user.role,
        createdAt: new Date(user.createdAt).toLocaleString('vi-VN', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
        status: user.isActive ? 'Hoạt động' : 'Đã khóa',
      })),
    [users],
  );

  return (
    <SidebarPage items={sidebarItemsAdmin} user={sidebarUser} canOpenProfile>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Quản lý người dùng
          </Typography>
          <Typography variant="body2" sx={{ color: '#4b5563' }}>
            Phân trang, chuyển user thành owner và quản lý tài khoản trong hệ
            thống.
          </Typography>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={roleFilter}
                label="Vai trò"
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setMeta((prev) => ({ ...prev, page: 1 }));
                }}
              >
                {ROLE_FILTERS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <MuiTextField
              label="Tìm theo email hoặc tên"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Điện thoại</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không tìm thấy bản ghi nào.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.createdAt}</TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        {row.role === 'user' && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleConvertToOwner(row.id)}
                            >
                              Phê duyệt owner
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              onClick={() => handleDeleteUser(row.id)}
                            >
                              Xóa
                            </Button>
                          </>
                        )}
                        {row.role === 'owner' && (
                          <>
                            <Button
                              size="small"
                              startIcon={<Edit fontSize="small" />}
                              onClick={() => handleOpenOwner(row.id)}
                            >
                              Sửa
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<Delete fontSize="small" />}
                              onClick={() => handleDeleteOwner(row.id)}
                            >
                              Xóa
                            </Button>
                          </>
                        )}
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => handleOpenUserDetail(row.id)}
                        >
                          Chi tiết
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" justifyContent="flex-end">
          <Pagination
            count={totalPages}
            page={meta.page}
            onChange={(_, value) =>
              setMeta((prev) => ({ ...prev, page: value }))
            }
          />
        </Stack>

        <Dialog
          open={ownerDialogOpen}
          onClose={() => setOwnerDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Cập nhật owner</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <MuiTextField
                label="Họ tên"
                value={ownerForm.fullName}
                onChange={(e) =>
                  setOwnerForm((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                fullWidth
              />
              <MuiTextField
                label="Số điện thoại"
                value={ownerForm.phone}
                onChange={(e) =>
                  setOwnerForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                fullWidth
              />
              <FormControl>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  label="Trạng thái"
                  value={ownerForm.isActive ? 'active' : 'inactive'}
                  onChange={(e) =>
                    setOwnerForm((prev) => ({
                      ...prev,
                      isActive: e.target.value === 'active',
                    }))
                  }
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Đã khóa</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOwnerDialogOpen(false)}>Huỷ</Button>
            <Button variant="contained" onClick={handleUpdateOwner}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
        <AdminUserDetailDialog
          open={detailOpen}
          user={detailUser}
          onClose={() => setDetailOpen(false)}
        />
      </Stack>
    </SidebarPage>
  );
}
