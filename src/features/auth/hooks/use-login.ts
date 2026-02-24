import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EMAIL_REGEX } from '../../../constants/regex';
import type { LoginFormError, LoginFormState } from '../types/auth-types';

export function useLogin() {
  const [form, setForm] = useState<LoginFormState>({
    email: '',
    password: '',
  });

  const [errors, setError] = useState<LoginFormError>({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newError = {
      email: '',
      password: '',
    };

    if (!form.email) {
      newError.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(form.email)) {
      newError.email = 'Invalid email format';
    }

    if (!form.password) {
      newError.password = 'Password is required';
    } else if (form.password.length < 4) {
      newError.password = 'Minimum 4 characters required';
    }

    setError(newError);

    return !newError.email && !newError.password;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError((prev) => ({
      ...prev,
      [e.target.name]: '',
    }));
  };

  const handleSubmit = () => {
    const isValid = validate();
    if (!isValid) return;
    localStorage.setItem('user', JSON.stringify({ role: 'admin' }));
    navigate('/projects');
  };

  return {
    form,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
}
