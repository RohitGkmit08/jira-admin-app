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
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';

import { createProject, getProjects } from '../../../services/project.service';
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
  const navigate = useNavigate();

  // Fetch post from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      }
    };

    fetchProjects();
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setProjectName('');
  };

  // Create project from api
  const handleCreate = async () => {
    if (!projectName.trim()) return;

    try {
      const newProject = await createProject({
        name: projectName.trim(),
      });

      setProjects((prev) => [newProject, ...prev]);
      handleClose();
    } catch (err) {
      console.error('Failed to create project', err);
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
          onClick={handleOpen}
          startIcon={<AddIcon />}
          sx={{ height: 40, textTransform: 'none' }}
        >
          Create Project
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <Paper variant="outlined" sx={{ p: 2, minWidth: 160 }}>
          <Typography variant="body2" color="text.secondary">
            Total Projects
          </Typography>
          <Typography variant="h4" fontWeight={600}>
            {projects.length}
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, minWidth: 160 }}>
          <Typography variant="body2" color="text.secondary">
            Active Projects
          </Typography>
          <Typography variant="h4" fontWeight={600}>
            {projects.length}
          </Typography>
        </Paper>
      </Box>

      <Paper
        variant="outlined"
        sx={{ borderRadius: '8px', overflow: 'hidden' }}
      >
        {projects.length === 0 ? (
          <Box
            sx={{
              py: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <FolderOpenIcon
              sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.4 }}
            />
            <Typography color="text.secondary" fontWeight={500}>
              No projects yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click "Create Project" to get started
            </Typography>
          </Box>
        ) : (
          <Box>
            {projects.map((project, index) => (
              <Box key={project._id}>
                <Box
                  onClick={() =>
                    navigate(routeHelpers.projectDetails(project._id))
                  }
                  sx={{
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <FolderOpenIcon
                    fontSize="small"
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography fontWeight={500} fontSize={14}>
                    {project.name}
                  </Typography>
                  <Typography
                    fontSize={12}
                    color="text.secondary"
                    sx={{ ml: 'auto' }}
                  >
                    #{index + 1}
                  </Typography>
                </Box>

                {index < projects.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create Project</DialogTitle>

        <DialogContent>
          <TextField
            label="Project Name"
            fullWidth
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
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
