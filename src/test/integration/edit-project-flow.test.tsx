import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
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
  deleteProject: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return { ...actual, useNavigate: () => mockNavigate };
});

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
      { _id: '1', name: 'Existing Project' },
    ] as never);
  });

  const openEditMode = async () => {
    const editButton = await screen.findByTestId('edit-icon-1');
    await userEvent.click(editButton);
    return screen.findByRole('dialog');
  };

  test('renders existing project', async () => {
    renderPage();
    expect(await screen.findByText('Existing Project')).toBeInTheDocument();
  });

  test('edit icon is rendered', async () => {
    renderPage();
    const editButton = await screen.findByTestId('edit-icon-1');
    expect(editButton).toBeInTheDocument();
  });

  test('clicking edit icon opens edit dialog', async () => {
    renderPage();
    const dialog = await openEditMode();
    expect(dialog).toBeInTheDocument();
  });

  test('edit dialog pre-fills with existing project name', async () => {
    renderPage();
    await openEditMode();
    const input = screen.getByDisplayValue('Existing Project');
    expect(input).toBeInTheDocument();
  });

  test('successfully updates project name', async () => {
    vi.mocked(updateProject).mockResolvedValue({
      _id: '1',
      name: 'Updated Project',
    } as never);

    renderPage();
    await openEditMode();
    const input = screen.getByDisplayValue('Existing Project');
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Project');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(updateProject).toHaveBeenCalledWith('1', {
        name: 'Updated Project',
      });
    });
    expect(toast.success).toHaveBeenCalled();
  });

  test('project list remains visible after entering edit mode', async () => {
    renderPage();
    await openEditMode();
    expect(screen.getByText('Existing Project')).toBeInTheDocument();
  });

  test('cancel button closes dialog without saving', async () => {
    renderPage();
    await openEditMode();
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(updateProject).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('shows error toast when fetching projects fails', async () => {
    vi.mocked(getProjects).mockRejectedValue(new Error('Network error'));
    renderPage();
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('clicking project row navigates to project details', async () => {
    renderPage();
    await screen.findByText('Existing Project');
    await userEvent.click(screen.getByText('Existing Project'));
    expect(mockNavigate).toHaveBeenCalledWith('/projects/1');
  });
});
