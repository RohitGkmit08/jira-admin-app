import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import LoginForm from '../../features/login/components/login-form';

afterEach(() => {
  cleanup();
});

describe('LoginForm Unit Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  const renderLoginPage = () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );
  };

  const typeCredentials = async (email: string, password: string) => {
    await user.type(screen.getByLabelText(/email/i), email);
    await user.type(screen.getByLabelText(/password/i), password);
  };

  const clickSignIn = async () => {
    await user.click(screen.getByRole('button', { name: /sign in/i }));
  };

  beforeEach(() => {
    user = userEvent.setup();
    renderLoginPage();
  });

  test('renders login form', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  test('allows user to type email and password', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    await typeCredentials('test@example.com', 'password123');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('shows error when email is empty', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'password123');
    expect(emailInput).toHaveValue('');
    await clickSignIn();
    expect(screen.queryByText(/email.*required/i)).toBeInTheDocument();
  });

  test('shows error when password is empty', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(emailInput, 'test@example.com');
    expect(passwordInput).toHaveValue('');
    await clickSignIn();
    expect(screen.queryByText(/password.*required/i)).toBeInTheDocument();
  });

  test('shows validation errors when both fields are empty', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
    await clickSignIn();
    expect(screen.queryByText(/email.*required/i)).toBeInTheDocument();
    expect(screen.queryByText(/password.*required/i)).toBeInTheDocument();
  });
});
