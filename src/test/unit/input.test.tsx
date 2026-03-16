import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';

import Input from '../../components/common/input';

describe('Input component', () => {
  test('toggles password visibility', async () => {
    const user = userEvent.setup();

    render(<Input label="Password" type="password" />);

    const inputLabelText = screen.getByLabelText(/password/i);
    const visibilityButton = screen.getByRole('button');

    expect(inputLabelText).toHaveAttribute('type', 'password');

    fireEvent.mouseDown(visibilityButton);
    await user.click(visibilityButton);

    expect(inputLabelText).toHaveAttribute('type', 'text');
  });
});
