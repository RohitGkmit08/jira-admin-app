import { vi } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../api/auth.api', () => ({
  loginUser: vi.fn(),
}));

vi.mock('../services/auth.service', () => ({
  authService: {
    setAuth: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { loginUser } from '../api/auth.api';
import { ROUTES } from '../constants/routes';
import LoginForm from '../features/login/components/login-form';

afterEach(() => {
  cleanup();
});

describe('Login Flow', () => {
  const user = userEvent.setup();

  const renderLoginPage = () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    renderLoginPage();
  });

  // selectors
  const getEmailInput = () => screen.getByLabelText('Email');
  const getPasswordInput = () => screen.getByLabelText('Password');
  const getSignInButton = () =>
    screen.getByRole('button', { name: /sign in/i });
  const getEmailRequiredError = () => screen.getByText(/email.*required/i);
  const getPasswordRequiredError = () =>
    screen.getByText(/password.*required/i);
  const getInvalidEmailError = () => screen.getByText(/invalid email/i);

  // user actions
  const typeEmail = async (email: string) => {
    await user.type(getEmailInput(), email);
  };

  const typePassword = async (password: string) => {
    await user.type(getPasswordInput(), password);
  };

  const clickSignIn = async () => {
    await user.click(getSignInButton());
  };

  // tests
  test('renders login form', () => {
    expect(getEmailInput()).toBeInTheDocument();
    expect(getPasswordInput()).toBeInTheDocument();
    expect(getSignInButton()).toBeInTheDocument();
  });

  test('allows user to type email and password', async () => {
    await typeEmail('test@example.com');
    await typePassword('password123');

    expect(getEmailInput()).toHaveValue('test@example.com');
    expect(getPasswordInput()).toHaveValue('password123');
  });

  test('allows user to click sign in button', async () => {
    await clickSignIn();
    expect(getSignInButton()).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    await clickSignIn();

    expect(getEmailRequiredError()).toBeInTheDocument();
    expect(getPasswordRequiredError()).toBeInTheDocument();
  });

  test('shows error when email format is invalid', async () => {
    await typeEmail('invalid-email');
    await typePassword('password123');
    await clickSignIn();

    expect(getInvalidEmailError()).toBeInTheDocument();
  });

  test('shows error when password is shorter than minimum length', async () => {
    await typeEmail('test@example.com');
    await typePassword('abc');

    await clickSignIn();

    expect(
      screen.getByText(/minimum 4 characters required/i),
    ).toBeInTheDocument();
  });

  test('calls login API when user submits valid credentials', async () => {
    const mockedLoginUser = vi.mocked(loginUser);

    mockedLoginUser.mockResolvedValue({
      token: 'mock-token',
      user: {
        _id: '123',
        email: 'test@example.com',
        role: 'user',
      },
    });

    await typeEmail('test@example.com');
    await typePassword('password123');
    await clickSignIn();

    expect(mockedLoginUser).toHaveBeenCalledTimes(1);

    expect(mockedLoginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('navigates to projects page after successful login', async () => {
    const mockedLoginUser = vi.mocked(loginUser);

    mockedLoginUser.mockResolvedValue({
      token: 'mock-token',
      user: {
        _id: '123',
        email: 'test@example.com',
        role: 'user',
      },
    });

    await typeEmail('test@example.com');
    await typePassword('password123');
    await clickSignIn();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.APP.PROJECTS);
    });
  });
});
