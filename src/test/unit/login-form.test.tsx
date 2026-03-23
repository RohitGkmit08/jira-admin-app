import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import LoginForm from '../../features/login/components/login-form';

afterEach(() => {
  cleanup();
});

describe('LoginForm component', () => {
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

  test('allows user to type email and password', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    await typeCredentials('test@example.com', 'password123');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('shows error when email is empty', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveValue('');
    await clickSignIn();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  test('shows error for invalid email format', async () => {
    await typeCredentials('invalid-email', 'password123');
    await clickSignIn();
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  test('shows error when password is empty', async () => {
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveValue('');
    await clickSignIn();
    expect(
      await screen.findByText(/password is required/i),
    ).toBeInTheDocument();
  });

  test('shows error when password is less than 4 characters', async () => {
    await typeCredentials('test@example.com', '123');
    await clickSignIn();
    expect(
      await screen.findByText(/minimum 4 characters required/i),
    ).toBeInTheDocument();
  });
});
