import { useEffect } from 'react';
import { Stack, Alert } from '@mui/material';
import type { FormEvent } from 'react';
import { useSnackbar } from 'notistack';

import Input from '../../../components/common/input';
import PasswordInput from '../../../components/common/input/password-input';
import LoadingButton from '../../../components/common/loading-button';
import { useLogin } from '../hooks/use-login';

const LoginForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { form, errors, apiError, handleChange, handleSubmit, loading } =
    useLogin();

  useEffect(() => {
    if (apiError) {
      enqueueSnackbar(apiError, { variant: 'error' });
    }
  }, [apiError, enqueueSnackbar]);

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

        <PasswordInput
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          autoComplete="current-password"
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          fullWidth
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </LoadingButton>
      </Stack>
    </form>
  );
};

export default LoginForm;
