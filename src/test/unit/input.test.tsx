import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';

import Input from '../../components/common/input';

afterEach(() => {
  cleanup();
});

let user: UserEvent;
beforeEach(() => {
  user = userEvent.setup();
});
describe('Input component', () => {
  test('passes value prop correctly', () => {
    render(<Input label="Email" value="test@example.com" />);
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
  });

  test('calls onChange when typing', async () => {
    const handleChange = vi.fn();
    render(<Input label="Email" type="text" onChange={handleChange} />);
    const input = screen.getByLabelText(/email/i);
    await user.type(input, 'abc');
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  test('toggles password visibility', async () => {
    render(<Input label="Password" type="password" />);
    const passwordField = screen.getByLabelText(/password/i);
    const toggleBtn = screen.getByRole('button');
    expect(passwordField).toHaveAttribute('type', 'password');
    await user.click(toggleBtn);
    expect(passwordField).toHaveAttribute('type', 'text');
  });

  test('does not render toggle button for non-password input', () => {
    render(<Input label="Email" type="text" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
