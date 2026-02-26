import { Box, Paper, Typography, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import LoginForm from '../components/login-form';

export default function LoginPage() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          width: 380,
          borderRadius: '8px',
        }}
      >
        {/* ICON + TITLE */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '8px',
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <LockOutlinedIcon sx={{ color: '#ffffff', fontSize: 22 }} />
          </Box>

          <Typography variant="h6" fontWeight={700}>
            Welcome back
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Sign in to your account
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <LoginForm />
      </Paper>
    </Box>
  );
}
