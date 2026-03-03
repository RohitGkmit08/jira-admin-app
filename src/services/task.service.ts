import { apiFetch } from '../api';
import type { Status } from '../features/projects/constants';

export const getTasks = async (projectId: string) => {
  return await apiFetch(`/tasks?projectId=${projectId}`);
};

export const createTask = async (data: {
  title: string;
  projectId: string;
  status: Status;
}) => {
  return await apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateTask = async (
  id: string,
  data: { status?: Status; title?: string },
) => {
  return await apiFetch(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
