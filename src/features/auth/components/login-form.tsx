import { Button, Stack } from '@mui/material';

import Input from '../../../components/common/input';
import { useLogin } from '../hooks/use-login';

export default function LoginForm() {
  const { form, errors, handleChange, handleSubmit, loading } = useLogin();

  return (
    <Stack spacing={2}>
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        error={Boolean(errors.password)}
        helperText={errors.password}
      />

      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Stack>
  );
}
