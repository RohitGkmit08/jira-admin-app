import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

import Input from '../../components/common/input';

afterEach(() => {
  cleanup();
});

describe('Input component', () => {
  test('renders input with label', () => {
    render(<Input label="Email" type="text" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('passes value prop correctly', () => {
    render(<Input label="Email" type="text" value="test@example.com" />);
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
  });

  test('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input label="Email" type="text" onChange={handleChange} />);
    const input = screen.getByLabelText(/email/i);
    await user.type(input, 'abc');
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<Input label="Password" type="password" />);
    const input = screen.getByLabelText(/password/i);
    const toggleBtn = screen.getByRole('button');
    expect(input).toHaveAttribute('type', 'password');
    await user.click(toggleBtn);
    expect(input).toHaveAttribute('type', 'text');
  });

  test('does not render toggle button for non-password input', () => {
    render(<Input label="Email" type="text" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
