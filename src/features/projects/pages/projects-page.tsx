import { useState } from 'react';
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
} from '@mui/material';

import PageContainer from '../../../components/common/page-container';

type Project = {
  id: number;
  name: string;
};

export default function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setProjectName('');
  };

  const handleCreate = () => {
    if (!projectName.trim()) return;

    const newProject: Project = {
      id: Date.now(),
      name: projectName,
    };

    setProjects((prev) => [...prev, newProject]);
    handleClose();
  };

  return (
    <PageContainer title="Projects">
      {/* HEADER */}
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

        <Button variant="contained" onClick={handleOpen} sx={{ height: 40 }}>
          Create Project
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* STATS */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <Paper
          sx={{
            p: 2,
            minWidth: 200,
            border: '1px solid #eee',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Total Projects
          </Typography>
          <Typography variant="h4" fontWeight={600}>
            {projects.length}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2,
            minWidth: 200,
            border: '1px solid #eee',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Active Projects
          </Typography>
          <Typography variant="h4" fontWeight={600}>
            {projects.length}
          </Typography>
        </Paper>
      </Box>

      {/* PROJECT LIST */}
      <Paper sx={{ p: 2, maxHeight: 400, overflowY: 'auto' }}>
        {projects.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary" mb={1}>
              No projects yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click "Create Project" to get started
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={1}>
            {projects.map((project) => (
              <Box
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid #eee',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    borderColor: '#ddd',
                    cursor: 'pointer',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <Typography fontWeight={500}>{project.name}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* CREATE PROJECT MODAL */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!projectName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}
