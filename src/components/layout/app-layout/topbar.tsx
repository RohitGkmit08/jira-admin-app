import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

type Props = {
  onMenuClick: () => void;
};

export default function Topbar({ onMenuClick }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>

        <Typography sx={{ flexGrow: 1 }}>Dashboard</Typography>

        <Button onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}