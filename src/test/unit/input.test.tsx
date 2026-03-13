import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';

import Input from '../../components/common/input';

describe('Input component', () => {
  test('toggles password visibility', async () => {
    const user = userEvent.setup();

    render(<Input label="Password" type="password" />);

    const input = screen.getByLabelText(/password/i);
    const toggleBtn = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.mouseDown(toggleBtn);
    await user.click(toggleBtn);

    expect(input).toHaveAttribute('type', 'text');
  });
});
