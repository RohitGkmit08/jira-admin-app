import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

type Props = {
  mobileOpen: boolean;
  onToggle: () => void;
};

export default function Sidebar({ mobileOpen, onToggle }: Props) {
  const navigate = useNavigate();

  const content = (
    <Box>
      <Toolbar />

      <List>
        <ListItemButton onClick={() => navigate('/projects')}>
          <ListItemText primary="Projects" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
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

      {/* Desktop Drawer */}
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
    </>
  );
}
