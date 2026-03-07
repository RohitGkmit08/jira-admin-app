import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';

import { apiFetch } from '../../api';
import ConfirmDialog from '../../components/common/confirm-dialog';

type AdminUser = {
  _id: string;
  email: string;
  role: 'admin' | 'user';
};

export default function AdminDashboard() {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [open, setOpen] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsersLoading(true);
        const data = await apiFetch('/users');
        setUsers(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load users';
        enqueueSnackbar(message, { variant: 'error' });
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, [enqueueSnackbar]);

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setDeleteLoading(true);
      await apiFetch(`/users/${selectedUser._id}`, {
        method: 'DELETE',
      });

      setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
      setOpen(false);
      setSelectedUser(null);
      enqueueSnackbar('User deleted', { variant: 'success' });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete user';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Admin Dashboard
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Users ({users.length})
        </Typography>

        {usersLoading ? (
          <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={1}>
            {users.map((user) => (
              <Box
                key={user._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #eee',
                  pb: 1,
                }}
              >
                <Typography>
                  {user.email} — {user.role}
                </Typography>

                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => handleDeleteClick(user)}
                >
                  Delete
                </Button>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>

      <ConfirmDialog
        open={open}
        onClose={handleClose}
        title="Delete User"
        message={
          <>
            Are you sure you want to delete{' '}
            <strong>{selectedUser?.email}</strong>?
          </>
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        confirmColor="error"
      />
    </Box>
  );
}
