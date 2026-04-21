import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  ExitToApp,
  AdminPanelSettings,
  Group,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { adminApi, Partner, PartnerUpdateRequest } from '../services/adminApi';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const theme = useTheme();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [editForm, setEditForm] = useState({
    is_banned: false,
    active_until: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllPartners();
      setPartners(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load partners:', err);
      setError('Failed to load partners. Please check your admin token.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (partner: Partner) => {
    setEditingPartner(partner);
    setEditForm({
      is_banned: partner.is_banned,
      active_until: partner.active_until || '',
    });
    setEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPartner) return;

    setUpdateLoading(true);
    try {
      const updateData: PartnerUpdateRequest = {
        is_banned: editForm.is_banned,
        active_until: editForm.active_until || null,
      };

      await adminApi.updatePartner(editingPartner.id, updateData);
      
      await loadPartners();
      setEditDialog(false);
      setEditingPartner(null);
    } catch (err: any) {
      console.error('Failed to update partner:', err);
      setError('Failed to update partner');
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Partner name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      minWidth: 280,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'is_banned',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Chip
            label={params.value ? 'Banned' : 'Active'}
            color={params.value ? 'error' : 'success'}
            size="small"
            icon={params.value ? <Block /> : <CheckCircle />}
            sx={{ my: 0.5 }}
          />
        </Box>
      ),
    },
    {
      field: 'active_until',
      headerName: 'Active until',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params.row)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            <Edit />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleLogout = () => {
    adminApi.removeAdminToken();
    onLogout();
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.background.default,
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 3,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AdminPanelSettings
              sx={{
                fontSize: 32,
                color: theme.palette.primary.main,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Admin panel
            </Typography>
          </Box>

          <Button
            onClick={handleLogout}
            variant="outlined"
            size="small"
            startIcon={<ExitToApp />}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              borderRadius: 2,
              px: 2,
              py: 1,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              '&:hover': {
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                backgroundColor: 'transparent',
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Group sx={{ fontSize: 28, color: theme.palette.text.secondary }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Partners management
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Manage system partners, their status and access permissions
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={loadPartners}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
          <CardContent sx={{ p: 0 }}>
            <DataGrid
              rows={partners}
              columns={columns}
              disableRowSelectionOnClick
              autoHeight
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1E293B',
                  borderRadius: 0,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                },
                '& .MuiDataGrid-cell': {
                  fontSize: '0.9rem',
                  px: 2,
                  py: 2,
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  px: 1,
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: theme.palette.mode === 'light'
                    ? 'rgba(99, 102, 241, 0.04)'
                    : 'rgba(99, 102, 241, 0.1)',
                },
                '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
                  borderBottom: 'none',
                  pb: 3,
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                  mt: 1,
                  py: 1.5,
                },
              }}
            />
          </CardContent>
        </Card>
      </Container>

      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Edit partner: {editingPartner?.name}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={editForm.is_banned}
                  onChange={(e) => setEditForm({ ...editForm, is_banned: e.target.checked })}
                  color="error"
                />
              }
              label="Ban partner"
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '1rem',
                  fontWeight: 500,
                },
              }}
            />

            <TextField
              fullWidth
              label="Active until"
              type="datetime-local"
              value={editForm.active_until}
              onChange={(e) => setEditForm({ ...editForm, active_until: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Leave empty for unlimited access"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setEditDialog(false)}
            disabled={updateLoading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={updateLoading}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
            }}
          >
            {updateLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;