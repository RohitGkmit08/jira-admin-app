import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  IconButton,
  CircularProgress,
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import {
  createProject,
  getProjects,
  deleteProject,
  updateProject,
} from '../../../services/project.service';
import PageContainer from '../../../components/common/page-container';
import { routeHelpers } from '../../../constants/routes';

type Project = {
  _id: string;
  name: string;
};

export default function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [loading, setLoading] = useState(true);

  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreate = async () => {
    if (!projectName.trim()) return;

    try {
      setCreateLoading(true);

      const newProject = await createProject({
        name: projectName.trim(),
      });

      setProjects((prev) => [newProject, ...prev]);
      setOpen(false);
      setProjectName('');
    } catch (err) {
      console.error('Failed to create project', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      await deleteProject(deleteId);

      setProjects((prev) => prev.filter((p) => p._id !== deleteId));

      setDeleteId(null);
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editId || !editName.trim()) return;

    try {
      setUpdateLoading(true);

      const updated = await updateProject(editId, {
        name: editName.trim(),
      });

      setProjects((prev) =>
        prev.map((project) => (project._id === editId ? updated : project)),
      );

      setEditId(null);
      setEditName('');
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const stats = [
    { label: 'Total Projects', length: projects.length },
    { label: 'Active Projects', length: projects.length },
  ];

  return (
    <PageContainer title="Projects">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            All Projects
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Create and manage your projects
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ height: 40, textTransform: 'none' }}
        >
          Create Project
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        {stats.map(({ label, length }) => (
          <Paper key={label} variant="outlined" sx={{ p: 2, minWidth: 160 }}>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>

            <Typography variant="h4">{length}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper
        variant="outlined"
        sx={{ borderRadius: '8px', overflow: 'hidden' }}
      >
        {loading ? (
          <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : projects.length === 0 ? (
          <Box
            sx={{
              py: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <FolderOpenIcon sx={{ fontSize: 40, opacity: 0.4 }} />
            <Typography color="text.secondary">No projects yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Click "Create Project" to get started
            </Typography>
          </Box>
        ) : (
          <Box>
            {projects.map((project, index) => (
              <Box key={project._id}>
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <FolderOpenIcon
                    fontSize="small"
                    sx={{ color: 'primary.main' }}
                  />

                  <Typography
                    fontWeight={500}
                    fontSize={14}
                    onClick={() =>
                      navigate(routeHelpers.projectDetails(project._id))
                    }
                  >
                    {project.name}
                  </Typography>

                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    sx={{ ml: 'auto' }}
                  >
                    #{index + 1}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditId(project._id);
                      setEditName(project.name);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => setDeleteId(project._id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                {index < projects.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Create Project */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Project</DialogTitle>

        <DialogContent>
          <TextField
            label="Project Name"
            fullWidth
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            sx={{ mt: 1 }}
            autoFocus
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!projectName.trim() || createLoading}
          >
            {createLoading ? <CircularProgress size={20} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Project */}
      <Dialog
        open={Boolean(editId)}
        onClose={() => setEditId(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Project</DialogTitle>

        <DialogContent>
          <TextField
            label="Project Name"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditId(null)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={!editName.trim() || updateLoading}
          >
            {updateLoading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Project */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Project?</DialogTitle>

        <DialogContent>
          <Typography>Are you sure you want to delete this project?</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
