import { Box } from '@mui/material';
import { useState } from 'react';
import type { ReactNode } from 'react';

import Sidebar from './sidebar';
import Topbar from './topbar';

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box display="flex">
      <Sidebar mobileOpen={mobileOpen} onToggle={handleToggle} />

      <Box flex={1}>
        <Topbar onMenuClick={handleToggle} />

        <Box p={2}>{children}</Box>
      </Box>
    </Box>
  );
}
