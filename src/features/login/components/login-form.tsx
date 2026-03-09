import { Stack } from '@mui/material';
import toast from 'react-hot-toast';
import type { FormEvent } from 'react';

import Input from '../../../components/common/input';
import PasswordInput from '../../../components/common/input/password-input';
import Button from '../../../components/common/button';
import { useLogin } from '../hooks/use-login';

const LoginForm = () => {
  const { form, errors, loading, handleChange, handleSubmit } = useLogin(
    (message) => toast.error(message),
  );

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

        <Button type="submit" variant="contained" loading={loading} fullWidth>
          Sign in
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
