import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

type Props = {
  onMenuClick: () => void;
};

export default function Topbar({ onMenuClick }: Props) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: '1px solid #eee',
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {/* MOBILE MENU */}
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* APP TITLE */}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Jira Admin
        </Typography>

        {/* RIGHT SIDE */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* USER INFO */}
          <Typography variant="body2" color="text.secondary">
            {user?.role || 'User'}
          </Typography>

          {/* LOGOUT */}
          <Button onClick={handleLogout} variant="outlined" size="small">
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
