import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
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
import PageHeader from '../../../components/common/page-header';
import StatCard from '../../../components/common/stat-card';
import EmptyState from '../../../components/common/empty-state';
import ConfirmDialog from '../../../components/common/confirm-dialog';
import FormActions from '../../../components/common/form-actions';
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
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load projects';
        enqueueSnackbar(message, { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [enqueueSnackbar]);

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
      enqueueSnackbar('Project created', { variant: 'success' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create project';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      await deleteProject(deleteId);

      setProjects((prev) => prev.filter((project) => project._id !== deleteId));

      setDeleteId(null);
      enqueueSnackbar('Project deleted', { variant: 'success' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete project';
      enqueueSnackbar(message, { variant: 'error' });
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
      enqueueSnackbar('Project updated', { variant: 'success' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update project';
      enqueueSnackbar(message, { variant: 'error' });
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
      <PageHeader
        title="All Projects"
        subtitle="Create and manage your projects"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ height: 40, textTransform: 'none' }}
          >
            Create Project
          </Button>
        }
      />

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        {stats.map(({ label, length }) => (
          <StatCard key={label} label={label} value={length} />
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
          <EmptyState
            icon={
              <FolderOpenIcon sx={{ fontSize: 40, opacity: 0.4 }} />
            }
            title="No projects yet"
            description='Click "Create Project" to get started'
          />
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

        <FormActions
          onCancel={() => setOpen(false)}
          submitLabel="Create"
          onSubmit={handleCreate}
          loading={createLoading}
          disabled={!projectName.trim()}
        />
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

        <FormActions
          onCancel={() => setEditId(null)}
          submitLabel="Save"
          onSubmit={handleUpdate}
          loading={updateLoading}
          disabled={!editName.trim()}
        />
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete Project?"
        message="Are you sure you want to delete this project?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteLoading}
        confirmColor="error"
      />
    </PageContainer>
  );
}
