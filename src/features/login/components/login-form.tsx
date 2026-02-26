import { Button, Stack } from '@mui/material';
import type { FormEvent } from 'react';

import Input from '../../../components/common/input';
import { useLogin } from '../hooks/use-login';

export default function LoginForm() {
  const { form, errors, handleChange, handleSubmit, loading } = useLogin();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={2}>
        <Input
          label="Email"
          name="email"
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

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          sx={{
            mt: 1,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </Stack>
    </form>
  );
}
