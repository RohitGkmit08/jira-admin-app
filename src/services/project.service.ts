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

export const deleteProject = async (id: string) => {
  return await apiFetch(`/projects/${id}`, {
    method: 'DELETE',
  });
};

export const updateProject = async (id: string, data: { name: string }) => {
  return await apiFetch(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
