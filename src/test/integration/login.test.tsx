import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import toast from 'react-hot-toast';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { loginUser } from '../../api/auth.api';
import { ROUTES } from '../../constants/routes';
import LoginForm from '../../features/login/components/login-form';

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
    mockNavigate.mockClear();
    // render login page once before every test
    renderLoginPage();
  });

  test('renders login form', () => {
    //assert
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  test('allows user to type email and password', async () => {
    //arrange
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    //act
    await typeCredentials('test@example.com', 'password123');

    // assert
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('shows error when email is empty', async () => {
    //arrange
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'password123');

    // email field is empty before submitting
    expect(emailInput).toHaveValue('');

    // act
    await clickSignIn();

    // assert (using queryBy because validation error appears conditionally)
    expect(screen.queryByText(/email.*required/i)).toBeInTheDocument();
  });

  test('shows error when password is empty', async () => {
    // arrange
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');

    // password field is empty
    expect(passwordInput).toHaveValue('');

    // act
    await clickSignIn();

    // assert
    expect(screen.queryByText(/password.*required/i)).toBeInTheDocument();
  });

  test('shows validation errors when both fields are empty', async () => {
    // arrange
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // both inputs are empty before submission
    expect(emailInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');

    // act
    await clickSignIn();

    // assert
    expect(screen.queryByText(/email.*required/i)).toBeInTheDocument();
    expect(screen.queryByText(/password.*required/i)).toBeInTheDocument();
  });

  test('calls login API when credentials are valid', async () => {
    // arrange
    const mockedLoginUser = vi.mocked(loginUser);
    const expectedAuth = mockLoginSuccess();
    mockedLoginUser.mockResolvedValue(expectedAuth);
    await typeCredentials('test@example.com', 'password123');

    // act
    await clickSignIn();

    // assert
    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledTimes(1);
    });

    expect(mockedLoginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('shows error toast and prevents navigation when login fails', async () => {
    // arrange
    const mockedLoginUser = vi.mocked(loginUser);
    mockedLoginUser.mockRejectedValue(new Error('Invalid credentials'));
    await typeCredentials('test@example.com', 'password123');

    // act
    await clickSignIn();

    // assert
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('allows resubmission after failed login', async () => {
    // arrange
    const mockedLoginUser = vi.mocked(loginUser);

    mockedLoginUser
      .mockRejectedValueOnce(new Error('Invalid credentials'))
      .mockResolvedValueOnce(mockLoginSuccess());

    await typeCredentials('test@example.com', 'password123');

    // act
    await clickSignIn();

    // assert first failure
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
    // act again (retry login)
    await clickSignIn();
    // assert retry occurred
    await waitFor(() => {
      expect(mockedLoginUser).toHaveBeenCalledTimes(2);
    });
  });

  test('navigates to projects page after successful login', async () => {
    // arrange
    const mockedLoginUser = vi.mocked(loginUser);
    mockedLoginUser.mockResolvedValue(mockLoginSuccess());

    await typeCredentials('test@example.com', 'password123');

    // act
    await clickSignIn();

    // assert
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.APP.PROJECTS);
    });

    expect(toast.success).toHaveBeenCalled();
  });

  test('stores auth token after successful login', async () => {
    // arrange
    const { authService } = await import('../../services/auth.service');
    const expectedAuth = mockLoginSuccess();
    vi.mocked(loginUser).mockResolvedValue(expectedAuth);

    await typeCredentials('test@example.com', 'password123');

    // act
    await clickSignIn();

    // assert
    await waitFor(() => {
      expect(authService.setAuth).toHaveBeenCalledWith(
        expectedAuth.token,
        expectedAuth.user,
      );
    });
  });
});
