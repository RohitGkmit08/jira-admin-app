import { Box, Typography } from '@mui/material';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function PageContainer({ title, children }: Props) {
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        {title}
      </Typography>

      <Box>{children}</Box>
    </Box>
  );
}
