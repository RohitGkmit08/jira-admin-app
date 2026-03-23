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
    const createButton = screen.getByRole('button', {
      name: /create project/i,
    });
    await userEvent.click(createButton);
    await screen.findByRole('dialog');
  };

  const submitProjectForm = async (projectName: string) => {
    const label = screen.getByLabelText(/project name/i);
    await userEvent.clear(label);
    await userEvent.type(label, projectName);
    await userEvent.click(screen.getByRole('button', { name: /^create$/i }));
  };

  test('create project button is visible and enabled', () => {
    const button = screen.getByRole('button', {
      name: /create project/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test('shows empty state when no projects exist', async () => {
    const projects = await getProjects();
    expect(projects).toHaveLength(0);

    expect(await screen.findByText(/no projects yet/i)).toBeInTheDocument();
  });

  test('input updates according to text typed', async () => {
    await openDialog();

    const input = screen.getByLabelText(/project name/i);
    await userEvent.type(input, 'New Project');

    expect(input).toHaveValue('New Project');
  });

  describe('Create button validation', () => {
    beforeEach(async () => {
      await openDialog();
    });

    test.each(['', '   '])(
      'should be disabled when project name is "%s"',
      async (input) => {
        if (input) {
          await userEvent.type(screen.getByLabelText(/project name/i), input);
        }

        expect(screen.getByRole('button', { name: /create/i })).toBeDisabled();
      },
    );

    test('create button is enabled for valid input', async () => {
      await userEvent.type(
        screen.getByLabelText(/project name/i),
        'Valid Project',
      );

      expect(screen.getByRole('button', { name: /create/i })).toBeEnabled();
    });
  });

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
