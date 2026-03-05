import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { apiFetch } from '../../api';

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
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete User</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{selectedUser?.email}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
