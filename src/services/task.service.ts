import { apiFetch } from '../api';
import type { Status } from '../features/projects/constants';

export const getTasks = async (projectId: string) => {
  return await apiFetch(`/tasks?projectId=${projectId}`);
};

export const createTask = async (data: {
  title: string;
  description?: string;
  projectId: string;
  status: Status;
}) => {
  return await apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateTask = async (
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: Status;
  },
) => {
  return await apiFetch(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteTask = async (taskId: string) => {
  return await apiFetch(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
};
