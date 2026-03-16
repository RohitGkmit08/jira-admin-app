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
    const editIcon = await screen.findByTestId('EditIcon');
    await user.click(editIcon.closest('button')!);
    return await screen.findByRole('dialog');
  };

  const submitEdit = async (name: string) => {
    const dialog = await openEditDialog();
    const input = within(dialog).getByLabelText(/project name/i);
    await user.clear(input);
    await user.type(input, name);

    await user.click(within(dialog).getByRole('button', { name: /^save$/i }));
  };

  test('project renders on screen', async () => {
    await renderPage();
    expect(screen.getByText(/test project/i)).toBeInTheDocument();
  });

  test('edit dialog opens when edit button clicked', async () => {
    await renderPage();
    const dialog = await openEditDialog();
    expect(dialog).toBeInTheDocument();
  });

  test('cancel closes edit dialog', async () => {
    await renderPage();
    await openEditDialog();
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  test('calls API with correct payload', async () => {
    await renderPage();

    const mockedUpdate = vi.mocked(updateProject);
    // XYZ project -> is the updated project name.
    mockedUpdate.mockResolvedValue(mockProject('XYZ project'));

    await submitEdit('XYZ project');

    await waitFor(() => {
      expect(mockedUpdate).toHaveBeenCalledWith('1', { name: 'XYZ project' });
    });
  });

  test('updates project successfully and updates UI', async () => {
    await renderPage();

    vi.mocked(updateProject).mockResolvedValue(
      mockProject('Updated Project Name'),
    );

    await submitEdit('Updated Project Name');

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Project updated');
    });

    expect(await screen.findByText('Updated Project Name')).toBeInTheDocument();
  });

  test('shows error toast when update fails', async () => {
    await renderPage();

    vi.mocked(updateProject).mockRejectedValue(new Error('Update failed'));

    await submitEdit('Updated Project Name');

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('update button disabled and loader shows while request pending', async () => {
    await renderPage();

    vi.mocked(updateProject).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockProject('Updated Name')), 500),
        ),
    );

    const dialog = await openEditDialog();

    const input = within(dialog).getByLabelText(/project name/i);
    await user.clear(input);
    await user.type(input, 'Updated Name');

    const button = within(dialog).getByRole('button', {
      name: /^save$/i,
    });

    await user.click(button);
    expect(button).toBeDisabled();
    expect(within(button).getByRole('progressbar')).toBeInTheDocument();
  });
});
