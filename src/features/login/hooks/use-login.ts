import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { EMAIL_REGEX } from '../../../constants/regex';
import { loginUser } from '../../../api/auth.api';
import { authService } from '../../../services/auth.service';
import type { LoginFormValues, LoginFormErrors } from '../types';
import { ROUTES } from '../../../constants/routes';

export function useLogin(onError?: (message: string) => void) {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormValues>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: LoginFormErrors = {};

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 4) {
      newErrors.password = 'Minimum 4 characters required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await loginUser(form);
      authService.setAuth(res.token, res.user);
      toast.success('Successfully logged in');
      navigate(ROUTES.APP.PROJECTS);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed, please try again';
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
}
