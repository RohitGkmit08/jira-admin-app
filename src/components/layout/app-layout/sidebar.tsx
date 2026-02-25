import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { NavLink } from 'react-router-dom';

const drawerWidth = 240;

type Props = {
  mobileOpen: boolean;
  onToggle: () => void;
};

export default function Sidebar({ mobileOpen, onToggle }: Props) {
  const content = (
    <Box>
      <Toolbar sx={{ minHeight: 64 }} />

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
