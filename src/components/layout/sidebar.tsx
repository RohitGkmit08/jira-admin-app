import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Divider,
  Typography,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

type Props = {
  mobileOpen: boolean;
  onToggle: () => void;
};

export default function Sidebar({ mobileOpen, onToggle }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const isProjectDetails = location.pathname.startsWith('/projects/');

  const content = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      <Toolbar sx={{ minHeight: 64 }} />

      <Box sx={{ flexGrow: 1, px: 1, pt: 1 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            px: 1.5,
            mb: 0.5,
          }}
        >
          Main Menu
        </Typography>

        <List sx={{ p: 0 }}>
          <NavLink to="/projects" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? '#ffffff' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.main' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 32,
                    color: isActive ? '#ffffff' : 'text.secondary',
                  }}
                >
                  <FolderIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Projects"
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            )}
          </NavLink>
        </List>
      </Box>

      {isProjectDetails && (
        <Box sx={{ px: 1, pb: 2 }}>
          <Divider sx={{ mb: 1.5 }} />

          <ListItemButton
            onClick={() => navigate('/projects')}
            sx={{
              borderRadius: '8px',
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
                color: 'text.primary',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: 'inherit',
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Back to Projects"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: 'background.paper',
          },
        }}
      >
        {content}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {content}
      </Drawer>
    </Box>
  );
}
