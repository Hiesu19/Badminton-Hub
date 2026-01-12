import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  TextField,
  Typography,
} from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import { SidebarPage, showErrorToast, showSuccessToast } from '@booking/shared';
import { sidebarItemsAdmin } from '@booking/shared/const/sidebarItems.js';
import {
  fetchAdminSuperCourts,
  fetchAdminSuperCourtDetail,
  updateAdminSuperCourt,
  deleteAdminSuperCourt,
} from '../services/adminSuperCourtService.js';
import AdminSuperCourtDetailDialog from '../components/AdminSuperCourtDetailDialog.jsx';
const STATUS_OPTIONS = [
  { label: 'Tất cả', value: '' },
  { label: 'Verifying', value: 'verifying' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const defaultMeta = { page: 1, limit: 10, total: 0 };

export default function AdminSuperCourtsPage() {
  const [superCourts, setSuperCourts] = useState([]);
  const [meta, setMeta] = useState(defaultMeta);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [queryTerm, setQueryTerm] = useState('');
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogForm, setDialogForm] = useState({
    status: '',
    name: '',
    address: '',
  });
  const [detailCourt, setDetailCourt] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [sidebarUser, setSidebarUser] = useState(null);

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
    loadSuperCourts();
  }, [meta.page, statusFilter, queryTerm]);

  const loadSuperCourts = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminSuperCourts({
        page: meta.page,
        limit: meta.limit,
        status: statusFilter || undefined,
        search: queryTerm || undefined,
      });
      const payload = res.data?.data ?? [];
      setSuperCourts(payload);
      const metadata = res.data?.meta ?? res.data?.metadata;
      if (metadata) {
        setMeta((prev) => ({ ...prev, total: metadata.total ?? prev.total }));
      }
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message ||
          'Không thể tải danh sách sân. Vui lòng thử lại.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setMeta((prev) => ({ ...prev, page: 1 }));
    setQueryTerm(searchKeyword.trim());
  };

  const handleOpenDialog = async (id) => {
    try {
      const res = await fetchAdminSuperCourtDetail(id);
      const court = res.data?.data;
      setSelectedCourt(court);
      setDialogForm({
        status: court?.status || 'verifying',
        name: court?.name || '',
        address: court?.address || '',
      });
      setDialogOpen(true);
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message || 'Không thể lấy thông tin sân.',
      );
    }
  };

  const handleSaveDialog = async () => {
    if (!selectedCourt) return;
    try {
      await updateAdminSuperCourt(selectedCourt.id, dialogForm);
      showSuccessToast('Cập nhật sân thành công');
      setDialogOpen(false);
      loadSuperCourts();
    } catch (err) {
      showErrorToast(err?.response?.data?.message || 'Không thể cập nhật sân.');
    }
  };

  const handleDeleteCourt = async (id) => {
    try {
      await deleteAdminSuperCourt(id);
      showSuccessToast('Xóa sân thành công');
      loadSuperCourts();
    } catch (err) {
      showErrorToast(err?.response?.data?.message || 'Không thể xóa sân.');
    }
  };

  const handleOpenCourtDetail = async (id) => {
    try {
      const res = await fetchAdminSuperCourtDetail(id);
      setDetailCourt(res.data?.data ?? null);
      setDetailOpen(true);
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message || 'Không thể lấy thông tin sân.',
      );
    }
  };

  const rows = useMemo(
    () =>
      superCourts.map((court) => ({
        id: court.id,
        name: court.name || '—',
        address: court.address || '—',
        status: court.status || 'verifying',
        owner: court.owner?.fullName || '—',
        user: court.user?.name ? court.user?.name : '—',
        createdAt: new Date(court.createdAt).toLocaleString('vi-VN', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
      })),
    [superCourts],
  );

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));

  return (
    <SidebarPage items={sidebarItemsAdmin} user={sidebarUser} canOpenProfile>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Quản lý sân
          </Typography>
          <Typography variant="body2" sx={{ color: '#4b5563' }}>
            Tìm kiếm, xét duyệt và xóa sân trong hệ thống.
          </Typography>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
          >
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setMeta((prev) => ({ ...prev, page: 1 }));
                }}
                label="Trạng thái"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Tìm theo tên hoặc địa chỉ"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
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
                <TableCell>Tên sân</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Chủ sân</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không tìm thấy sân nào.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.user}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.createdAt}</TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit fontSize="small" />}
                          onClick={() => handleOpenDialog(row.id)}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => handleOpenCourtDetail(row.id)}
                        >
                          Chi tiết
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Delete fontSize="small" />}
                          onClick={() => handleDeleteCourt(row.id)}
                        >
                          Xóa
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
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Chi tiết sân</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Tên sân"
                value={dialogForm.name}
                onChange={(e) =>
                  setDialogForm((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Địa chỉ"
                value={dialogForm.address}
                onChange={(e) =>
                  setDialogForm((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  label="Trạng thái"
                  value={dialogForm.status}
                  onChange={(e) =>
                    setDialogForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  {STATUS_OPTIONS.filter((opt) => opt.value).map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Huỷ</Button>
            <Button variant="contained" onClick={handleSaveDialog}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
        <AdminSuperCourtDetailDialog
          open={detailOpen}
          court={detailCourt}
          onClose={() => setDetailOpen(false)}
        />
      </Stack>
    </SidebarPage>
  );
}
