import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';

import { apiFetch } from '../../api';
import ListRow from '../../components/common/list-row';
import ConfirmDialog from '../../components/common/confirm-dialog';
import Button from '../../components/common/button';

type AdminUser = {
  _id: string;
  email: string;
  role: 'admin' | 'user';
};

export default function AdminDashboard() {
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
        toast.error(message);
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, []);

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
      toast.success('User deleted');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete user';
      toast.error(message);
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
          <Box>
            {users.map((user, index) => (
              <ListRow
                key={user._id}
                title={user.email}
                subtitle={user.role}
                showDivider={index < users.length - 1}
                actions={
                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    onClick={() => handleDeleteClick(user)}
                  >
                    Delete
                  </Button>
                }
              />
            ))}
          </Box>
        )}
      </Paper>

      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={
          <>
            Are you sure you want to delete{' '}
            <strong>{selectedUser?.email}</strong>?
          </>
        }
        confirmText="Delete"
        loading={deleteLoading}
        confirmColor="error"
      />
    </Box>
  );
}
