import { Button, Stack, Alert } from '@mui/material';
import type { FormEvent } from 'react';

import Input from '../../../components/common/input';
import { useLogin } from '../hooks/use-login';

const LoginForm = () => {
  const { form, errors, apiError, handleChange, handleSubmit, loading } =
    useLogin();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={2}>
        {apiError && <Alert severity="error">{apiError}</Alert>}

        <Input
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          autoComplete="password"
        />

        <Button type="submit" variant="contained" disabled={loading} fullWidth>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
