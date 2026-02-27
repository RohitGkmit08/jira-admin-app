import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
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

      <Box px={2} py={1}>
        <Typography variant="caption" color="text.secondary">
          MAIN
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>
        <NavLink to="/projects" style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <ListItemButton
              sx={{
                borderRadius: 1,
                mb: 0.5,
                px: 2,
                py: 1,
                bgcolor: isActive ? 'action.selected' : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemText
                primary="Projects"
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                }}
              />
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
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
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
            borderRight: '1px solid #eee', // subtle separation
          },
        }}
      >
        {content}
      </Drawer>
    </Box>
  );
}
