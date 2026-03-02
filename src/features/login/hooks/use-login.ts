import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { EMAIL_REGEX } from '../../../constants/regex';
import { loginUser } from '../../../api/auth.api';
import { authService } from '../../../services/auth.service';
import type { LoginFormValues, LoginFormErrors } from '../types';
import { ROUTES } from '../../../constants/routes';

export function useLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormValues>({
=======

import { loginUser } from '../../../api/auth.api';
import { authService } from '../../../services/auth.service';
import { ROUTES } from '../../../constants/routes';

type FormState = {
  email: string;
  password: string;
};

type FormErrors = {
  email?: string;
  password?: string;
};

export const useLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
>>>>>>> 8fd6412 (feat: integrate backend JWT with frontend)
    email: '',
    password: '',
  });

<<<<<<< HEAD
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
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
      authService.setToken(res.token);

      navigate(ROUTES.APP.PROJECTS);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, loading, handleChange, handleSubmit };
}
=======
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await loginUser(form);

      authService.setToken(res.token);
      navigate(ROUTES.APP.PROJECTS);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    handleChange,
    handleSubmit,
    loading,
  };
};
>>>>>>> 8fd6412 (feat: integrate backend JWT with frontend)
