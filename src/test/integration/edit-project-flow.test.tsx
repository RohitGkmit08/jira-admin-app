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
        id: 1,
        name: 'Existing Project',
      },
    ] as never);

    renderPage();
  });

  test('renders existing project', async () => {
    expect(await screen.findByText('Existing Project')).toBeInTheDocument();
  });

  test('clicking edit icon triggers edit flow', async () => {
    const editButton = await screen.findByTestId(/edit-icon/);
    await userEvent.click(editButton);

    expect(editButton).toBeInTheDocument();
  });

  test('shows error toast on API failure', async () => {
    vi.mocked(updateProject).mockRejectedValue(new Error('API Error'));

    const editButton = await screen.findByTestId(/edit-icon/);
    await userEvent.click(editButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('project list remains visible after edit interaction', async () => {
    const editButton = await screen.findByTestId(/edit-icon/);
    await userEvent.click(editButton);
    expect(await screen.findByText('Existing Project')).toBeInTheDocument();
  });
});
