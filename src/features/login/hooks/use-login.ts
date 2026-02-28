import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginUser } from '../../../api/auth.api';
import { authService } from '../../../services/auth.service';

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
    email: '',
    password: '',
  });

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
      navigate('/projects');
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
