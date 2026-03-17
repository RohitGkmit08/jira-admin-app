import { apiFetch } from '../api';

export const getProjects = async () => {
  return await apiFetch('/projects');
};

export const createProject = async (data: { name: string }) => {
  return await apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
