import { authService } from '../services/auth.service';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = authService.getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'API Error');
  }

  return res.json();
}
