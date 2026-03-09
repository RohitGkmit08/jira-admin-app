import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Divider,
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';

import PageContainer from '../../../components/common/page-container';
import AppDialog from '../../../components/common/app-dialog';
import { routeHelpers } from '../../../constants/routes';

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
      name: projectName.trim(),
    };

    setProjects((prev) => [...prev, newProject]);
    handleClose();
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
          onClick={handleOpen}
          startIcon={<AddIcon />}
          sx={{ height: 40, textTransform: 'none' }}
        >
          Create Project
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        {stats.map(({ label, length }) => (
          <Paper
            key={label}
            variant="outlined"
            sx={{
              p: 2,
              minWidth: 160,
              borderRadius: '8px',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              {length}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: '8px',
          overflow: 'hidden',
        }}
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
              <Box key={project.id}>
                <Box
                  onClick={() =>
                    navigate(routeHelpers.projectDetails(String(project.id)))
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

      <AppDialog
        open={open}
        onClose={handleClose}
        title="Create Project"
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!projectName.trim()}
            >
              Submit
            </Button>
          </>
        }
      >
        <TextField
          label="Project Name"
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          sx={{ mt: 1 }}
          autoFocus
        />
      </AppDialog>
    </PageContainer>
  );
}
