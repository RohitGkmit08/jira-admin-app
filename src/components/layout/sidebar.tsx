import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Divider,
  Button,
} from '@mui/material';
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
      }}
    >
      <Toolbar sx={{ minHeight: 64 }} />

      {/* TOP NAV */}
      <Box sx={{ flexGrow: 1 }}>
        <List sx={{ p: 0 }}>
          <NavLink to="/projects" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <ListItemButton
                sx={{
                  bgcolor: isActive ? 'action.selected' : 'transparent',
                }}
              >
                <ListItemText primary="Projects" />
              </ListItemButton>
            )}
          </NavLink>
        </List>
      </Box>

      {/* BOTTOM BACK BUTTON */}
      {isProjectDetails && (
        <Box px={2} pb={2}>
          <Divider sx={{ mb: 2 }} />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate('/projects')}
            sx={{
              textTransform: 'none',
              py: 1.5,
              fontWeight: 600,
            }}
          >
            ← Back to Projects
          </Button>
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
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {content}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {content}
      </Drawer>
    </Box>
  );
}
