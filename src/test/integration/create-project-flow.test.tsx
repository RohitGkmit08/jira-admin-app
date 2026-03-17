import { vi } from 'vitest';
import toast from 'react-hot-toast';

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

import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import ProjectsPage from '../../features/projects/pages';
import { createProject, getProjects } from '../../services/project.service';

const mockProject = (name = 'Test Project') => ({
  _id: crypto.randomUUID(),
  name,
});

describe('Project Creation Flow', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
    vi.mocked(getProjects).mockResolvedValue([]);
  });

  const renderPage = async () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getProjects).toHaveBeenCalled();
    });
  };

  const openDialog = async () => {
    await user.click(screen.getByRole('button', { name: /^create project$/i }));

    return screen.findByRole('dialog');
  };

  const submitProjectForm = async (name: string) => {
    const dialog = await openDialog();
    const dialogUtils = within(dialog);

    await user.type(dialogUtils.getByLabelText(/project name/i), name);

    await user.click(dialogUtils.getByRole('button', { name: /^create$/i }));
  };

  test('shows create project button on page load', async () => {
    await renderPage();

    expect(
      screen.getByRole('button', { name: /^create project$/i }),
    ).toBeInTheDocument();
  });

  test('opens create project dialog', async () => {
    await renderPage();

    const dialog = await openDialog();

    expect(dialog).toBeInTheDocument();
  });

  test('cancel closes dialog', async () => {
    await renderPage();

    const dialog = await openDialog();
    const dialogUtils = within(dialog);

    await user.type(
      dialogUtils.getByLabelText(/project name/i),
      'Test Project',
    );

    await user.click(dialogUtils.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('calls API with correct payload', async () => {
    await renderPage();

    const mockedCreate = vi.mocked(createProject);

    mockedCreate.mockResolvedValue(mockProject('Test Project'));

    await submitProjectForm('Test Project');

    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledWith({
        name: 'Test Project',
      });
    });
  });

  test('creates project successfully and updates UI', async () => {
    await renderPage();

    vi.mocked(createProject).mockResolvedValue(mockProject('Test Project'));

    await submitProjectForm('Test Project');

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Project created');
    });

    expect(await screen.findByText('Test Project')).toBeInTheDocument();
  });

  test('shows error toast when creation fails', async () => {
    await renderPage();

    vi.mocked(createProject).mockRejectedValue(new Error('Failed'));

    await submitProjectForm('Test Project');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('create button disabled and loader shows while request pending', async () => {
    await renderPage();

    vi.mocked(createProject).mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockProject()), 500)),
    );

    const dialog = await openDialog();
    const dialogUtils = within(dialog);

    await user.type(
      dialogUtils.getByLabelText(/project name/i),
      'Test Project',
    );

    const button = dialogUtils.getByRole('button', {
      name: /^create$/i,
    });

    await user.click(button);

    expect(button).toBeDisabled();
    expect(within(button).getByRole('progressbar')).toBeInTheDocument();
  });

  test('user can create multiple projects', async () => {
    await renderPage();

    const mockedCreate = vi.mocked(createProject);

    mockedCreate
      .mockResolvedValueOnce(mockProject('Project One'))
      .mockResolvedValueOnce(mockProject('Project Two'));

    await submitProjectForm('Project One');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(await screen.findByText('Project One')).toBeInTheDocument();

    await submitProjectForm('Project Two');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(await screen.findByText('Project Two')).toBeInTheDocument();
  });
});
