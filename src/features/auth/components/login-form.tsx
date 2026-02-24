import { TextField, Button, Stack } from '@mui/material';

import { useLogin } from '../hooks/use-login';

export default function LoginForm() {
  const { form, errors, handleChange, handleSubmit, loading } = useLogin();

  return (
    <Stack spacing={2}>
      <TextField
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
        fullWidth
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        error={Boolean(errors.password)}
        helperText={errors.password}
        fullWidth
      />

      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Stack>
  );
}
