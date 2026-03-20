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
import { createProject, getProjects } from '../../services/project.service';

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../services/project.service', () => ({
  createProject: vi.fn(),
  getProjects: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('Create Project Flow', () => {
  const renderPage = () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    vi.mocked(getProjects).mockResolvedValue([]);
    renderPage();
  });

  const openDialog = async () => {
    await userEvent.click(
      screen.getByRole('button', { name: /create project/i }),
    );
    await screen.findByRole('dialog');
  };

  const submitProjectForm = async (projectName: string) => {
    await userEvent.clear(screen.getByLabelText(/project name/i));
    await userEvent.type(screen.getByLabelText(/project name/i), projectName);
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));
  };

  test('shows empty state when no projects exist', async () => {
    expect(await screen.findByText(/no projects yet/i)).toBeInTheDocument();
  });

  test('opens create project dialog', async () => {
    await openDialog();
  });

  test('input updates when typing', async () => {
    await openDialog();
    const input = screen.getByLabelText(/project name/i);
    await userEvent.type(input, 'New Project');
    expect(input).toHaveValue('New Project');
  });

  test('create button is disabled when project name is empty', async () => {
    await openDialog();
    expect(screen.getByRole('button', { name: /^create$/i })).toBeDisabled();
  });

  test.each(['', '   '])(
    'create button is disabled when project name is "%s"',
    async (input) => {
      await openDialog();
      if (input) {
        await userEvent.type(screen.getByLabelText(/project name/i), input);
      }
      expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
    },
  );

  test('creates project successfully', async () => {
    vi.mocked(createProject).mockResolvedValue({
      id: '1',
      name: 'Test Project',
    } as never);

    await openDialog();
    await submitProjectForm('Test Project');
    await waitFor(() => {
      expect(createProject).toHaveBeenCalled();
    });
    expect(toast.success).toHaveBeenCalled();
  });

  test('closes dialog after successful creation', async () => {
    vi.mocked(createProject).mockResolvedValue({
      id: '1',
      name: 'Test Project',
    } as never);

    await openDialog();
    await submitProjectForm('Test Project');
    const dialog = screen.getByRole('dialog');
    await waitForElementToBeRemoved(dialog);
  });

  test('shows error toast on API failure', async () => {
    vi.mocked(createProject).mockRejectedValue(new Error('API Error'));
    await openDialog();
    await submitProjectForm('Test Project');
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('cancel button closes dialog', async () => {
    await openDialog();
    const dialog = screen.getByRole('dialog');
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await waitForElementToBeRemoved(dialog);
  });
});
