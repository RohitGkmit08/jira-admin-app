import { Box, Paper, Typography } from '@mui/material';

import LoginForm from '../components/login-form';
export default function LoginPage() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 400,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" mb={2}>
          Login
        </Typography>

        <LoginForm />
      </Paper>
    </Box>
  );
}
