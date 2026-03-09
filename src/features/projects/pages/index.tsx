import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Paper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  IconButton,
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
import Button from '../../../components/common/button';
import Loader from '../../../components/common/loader';
import StatCard from '../../../components/common/stat-card';
import EmptyState from '../../../components/common/empty-state';
import ListRow from '../../../components/common/list-row';
import ConfirmDialog from '../../../components/common/confirm-dialog';
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
        toast.error(
          err instanceof Error ? err.message : 'Failed to load projects',
        );
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
      const newProject = await createProject({ name: projectName.trim() });
      setProjects((prev) => [newProject, ...prev]);
      setOpen(false);
      setProjectName('');
      toast.success('Project created');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create project',
      );
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
      toast.success('Project deleted');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete project',
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editId || !editName.trim()) return;

    try {
      setUpdateLoading(true);
      const updated = await updateProject(editId, { name: editName.trim() });
      setProjects((prev) => prev.map((p) => (p._id === editId ? updated : p)));
      setEditId(null);
      setEditName('');
      toast.success('Project updated');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update project',
      );
    } finally {
      setUpdateLoading(false);
    }
  };

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
        {[
          { label: 'Total Projects', value: projects.length },
          { label: 'Active Projects', value: projects.length },
        ].map(({ label, value }) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </Box>

      <Paper
        variant="outlined"
        sx={{ borderRadius: '8px', overflow: 'hidden' }}
      >
        {loading ? (
          <Loader sx={{ py: 6 }} />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FolderOpenIcon sx={{ fontSize: 40 }} />}
            title="No projects yet"
            description='Click "Create Project" to get started'
          />
        ) : (
          <Box>
            {projects.map((project, index) => (
              <ListRow
                key={project._id}
                title={project.name}
                subtitle={`#${index + 1}`}
                icon={<FolderOpenIcon fontSize="small" />}
                onClick={() =>
                  navigate(routeHelpers.projectDetails(project._id))
                }
                showDivider={index < projects.length - 1}
                actions={
                  <>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditId(project._id);
                        setEditName(project.name);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(project._id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                }
              />
            ))}
          </Box>
        )}
      </Paper>

      {/* Create */}
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
            disabled={!projectName.trim()}
            loading={createLoading}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit */}
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
            disabled={!editName.trim()}
            loading={updateLoading}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project?"
        message="Are you sure you want to delete this project?"
        confirmText="Delete"
        confirmColor="error"
        loading={deleteLoading}
      />
    </PageContainer>
  );
}
