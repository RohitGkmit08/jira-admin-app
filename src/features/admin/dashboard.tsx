import { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

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

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        const data = await apiFetch('/users');
        if (mounted) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await apiFetch(`/users/${selectedUser._id}`, {
        method: 'DELETE',
      });

      setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
    } catch (error) {
      console.error('Failed to delete user', error);
    } finally {
      setOpen(false);
      setSelectedUser(null);
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
        confirmColor="error"
      />
    </Box>
  );
}
