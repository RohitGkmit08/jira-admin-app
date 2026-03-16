import { vi } from 'vitest';
import toast from 'react-hot-toast';

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

vi.mock('../../api/auth.api', () => ({
  loginUser: vi.fn(),
}));

vi.mock('../../services/auth.service', () => ({
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
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { loginUser } from '../../api/auth.api';
import { ROUTES } from '../../constants/routes';
import LoginForm from '../../features/login/components/login-form';

const mockLoginSuccess = () => ({
  token: 'mock-token',
  user: {
    _id: '123',
    email: 'test@example.com',
    role: 'user' as const,
  },
});

afterEach(() => {
  cleanup();
});

describe('Login Flow', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    mockNavigate.mockClear();
  });

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

  test('renders login form', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  test('allows user to type email and password', async () => {
    renderLoginPage();

    await typeCredentials('test@example.com', 'password123');

    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
  });

  test('shows error when email is empty', async () => {
    renderLoginPage();

    await user.type(screen.getByLabelText(/password/i), 'password123');
    await clickSignIn();

    expect(screen.getByText(/email.*required/i)).toBeInTheDocument();
  });

  test('shows error when password is empty', async () => {
    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await clickSignIn();

    expect(screen.getByText(/password.*required/i)).toBeInTheDocument();
  });

  test('shows validation errors when both fields are empty', async () => {
    renderLoginPage();

    await clickSignIn();

    expect(screen.getByText(/email.*required/i)).toBeInTheDocument();
    expect(screen.getByText(/password.*required/i)).toBeInTheDocument();
  });

  test('calls login API when credentials are valid', async () => {
    renderLoginPage();

    const mockedLoginUser = vi.mocked(loginUser);
    const expectedAuth = mockLoginSuccess();

    mockedLoginUser.mockResolvedValue(expectedAuth);

    await typeCredentials('test@example.com', 'password123');
    await clickSignIn();

    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledTimes(1);
    });

    expect(mockedLoginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('shows error toast and prevents navigation when login fails', async () => {
    renderLoginPage();

    const mockedLoginUser = vi.mocked(loginUser);
    mockedLoginUser.mockRejectedValue(new Error('Invalid credentials'));

    await typeCredentials('test@example.com', 'password123');
    await clickSignIn();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('navigates to projects page after successful login', async () => {
    renderLoginPage();

    const mockedLoginUser = vi.mocked(loginUser);
    mockedLoginUser.mockResolvedValue(mockLoginSuccess());

    await typeCredentials('test@example.com', 'password123');
    await clickSignIn();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.APP.PROJECTS);
    });

    expect(toast.success).toHaveBeenCalled();
  });

  test('stores auth token after successful login', async () => {
    const { authService } = await import('../../services/auth.service');

    renderLoginPage();

    const expectedAuth = mockLoginSuccess();
    vi.mocked(loginUser).mockResolvedValue(expectedAuth);

    await typeCredentials('test@example.com', 'password123');
    await clickSignIn();

    await waitFor(() => {
      expect(authService.setAuth).toHaveBeenCalledWith(
        expectedAuth.token,
        expectedAuth.user,
      );
    });
  });

  test('allows resubmission after failed login', async () => {
    renderLoginPage();

    const mockedLoginUser = vi.mocked(loginUser);

    mockedLoginUser
      .mockRejectedValueOnce(new Error('Invalid credentials'))
      .mockResolvedValueOnce(mockLoginSuccess());

    await typeCredentials('test@example.com', 'password123');
    await clickSignIn();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    await clickSignIn();

    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledTimes(2);
    });
  });
});
