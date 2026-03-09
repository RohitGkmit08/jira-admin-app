import { Box, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './sidebar';
import Topbar from './topbar';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar onMenuClick={handleToggle} />
      <Sidebar mobileOpen={mobileOpen} onToggle={handleToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1400px',
            p: 3,
          }}
        >
          <Toolbar sx={{ minHeight: 64 }} />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
