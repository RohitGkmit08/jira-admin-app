import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import toast from 'react-hot-toast';

import ProjectsPage from '../../features/projects/pages';
import { getProjects, updateProject } from '../../services/project.service';

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../services/project.service', () => ({
  getProjects: vi.fn(),
  updateProject: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('Edit Project Flow', () => {
  const renderPage = () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    vi.mocked(getProjects).mockResolvedValue([
      {
        _id: '1',
        name: 'Existing Project',
      },
    ] as never);

    renderPage();
  });

  test('renders existing project', async () => {
    expect(await screen.findByText('Existing Project')).toBeInTheDocument();
  });

  test('opens edit dialog on clicking edit icon', async () => {
    const editButton = await screen.findByTestId(/edit-icon-/);

    await userEvent.click(editButton);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  test('project list remains visible after edit interaction', async () => {
    const editButton = await screen.findByTestId(/edit-icon-/);

    await userEvent.click(editButton);

    expect(await screen.findByText('Existing Project')).toBeInTheDocument();
  });

  test('save button is disabled when input is empty', async () => {
    const editButton = await screen.findByTestId(/edit-icon-/);
    await userEvent.click(editButton);

    const input = await screen.findByLabelText(/project name/i);

    await userEvent.clear(input);

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  test('updates project successfully and shows success toast', async () => {
    vi.mocked(updateProject).mockResolvedValue({
      _id: '1',
      name: 'Updated Project',
    } as never);

    const editButton = await screen.findByTestId(/edit-icon-/);
    await userEvent.click(editButton);

    const input = await screen.findByLabelText(/project name/i);

    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Project');

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(updateProject).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });

    expect(await screen.findByText('Updated Project')).toBeInTheDocument();
  });

  test('shows error toast on API failure', async () => {
    vi.mocked(updateProject).mockRejectedValue(new Error('API Error'));

    const editButton = await screen.findByTestId(/edit-icon-/);
    await userEvent.click(editButton);

    const input = await screen.findByLabelText(/project name/i);

    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Project');

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(updateProject).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('cancel button closes edit dialog', async () => {
    const editButton = await screen.findByTestId(/edit-icon-/);
    await userEvent.click(editButton);

    const dialog = await screen.findByRole('dialog');

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitForElementToBeRemoved(dialog);
  });
});
