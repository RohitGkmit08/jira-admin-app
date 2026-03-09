import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

type ListRowProps = {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
  showDivider?: boolean;
};

const ListRow = ({
  title,
  subtitle,
  icon,
  actions,
  onClick,
  showDivider = true,
}: ListRowProps) => {
  return (
    <Box>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: onClick ? 'pointer' : 'default',
          '&:hover': onClick ? { backgroundColor: 'action.hover' } : {},
        }}
        onClick={onClick}
      >
        {icon && (
          <Box
            sx={{
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={500} fontSize={14}>
            {title}
          </Typography>
        </Box>

        {subtitle && (
          <Typography fontSize={12} color="text.secondary" sx={{ ml: 'auto' }}>
            {subtitle}
          </Typography>
        )}

        {actions && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              ml: subtitle ? 2 : 'auto',
            }}
          >
            {actions}
          </Box>
        )}
      </Box>

      {showDivider && <Divider />}
    </Box>
  );
};

export default ListRow;
