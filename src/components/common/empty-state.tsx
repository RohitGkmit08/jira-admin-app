import { Box, Typography } from '@mui/material';

type Props = {
  icon: React.ReactNode;
  title: string;
  description?: string;
};

const EmptyState = ({ icon, title, description }: Props) => {
  return (
    <Box
      sx={{
        py: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box sx={{ color: 'text.secondary', opacity: 0.4 }}>{icon}</Box>
      <Typography color="text.secondary">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyState;
