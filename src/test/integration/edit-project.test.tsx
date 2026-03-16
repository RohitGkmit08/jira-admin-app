import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import {
  render,
  screen,
  waitFor,
  cleanup,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getProjects, updateProject } from '../../services/project.service';
import { ProjectsPage } from '../../features/projects';

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

const mockProject = (name = 'Test Project') => ({
  _id: '1',
  name,
});

afterEach(() => {
  cleanup();
});

describe('edit project dialog flow', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
    vi.mocked(getProjects).mockResolvedValue([mockProject()]);
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

  const openEditDialog = async () => {
    const editButton = await screen.findByTestId('edit-icon-1');
    await user.click(editButton);
    return await screen.findByRole('dialog');
  };

  const submitEdit = async (name: string, beforeSave?: () => void) => {
    const dialog = await openEditDialog();
    const input = within(dialog).getByLabelText(/project name/i);
    await user.type(input, name);

    if (beforeSave) beforeSave();

    await user.click(within(dialog).getByRole('button', { name: /^save$/i }));
  };

  test('when edit button is clicked, open dialog', async () => {
    await renderPage();
    expect(screen.getByText(/test project/i)).toBeInTheDocument();
    const dialog = await openEditDialog();
    expect(dialog).toBeInTheDocument();
  });

  test('calls updateProject API with correct payload', async () => {
    await renderPage();

    await submitEdit(' updated', () => {
      const mockedUpdate = vi.mocked(updateProject);
      mockedUpdate.mockResolvedValue(mockProject('Test Project updated'));
    });

    await waitFor(() => {
      expect(vi.mocked(updateProject)).toHaveBeenCalledWith('1', {
        name: 'Test Project updated',
      });
    });
  });

  test('updates project successfully and updates UI', async () => {
    await renderPage();

    await submitEdit(' updated', () => {
      vi.mocked(updateProject).mockResolvedValue(
        mockProject('Test Project updated'),
      );
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Project updated');
    });

    expect(await screen.findByText('Test Project updated')).toBeInTheDocument();
  });

  test('shows error toast when update fails', async () => {
    await renderPage();

    await submitEdit(' updated', () => {
      vi.mocked(updateProject).mockRejectedValue(new Error('Update failed'));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('save button is disabled and loader shows while request pending', async () => {
    await renderPage();

    vi.mocked(updateProject).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockProject('Test Project updated')), 500),
        ),
    );

    const dialog = await openEditDialog();

    const input = within(dialog).getByLabelText(/project name/i);
    await user.type(input, ' updated');

    const saveButton = within(dialog).getByRole('button', {
      name: /^save$/i,
    });

    await user.click(saveButton);
    expect(saveButton).toBeDisabled();
    expect(within(saveButton).getByRole('progressbar')).toBeInTheDocument();
  });
});
