export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
  },

  APP: {
    ROOT: '/',
    PROJECTS: '/projects',
    PROJECT_DETAILS: '/projects/:projectId',
  },

  ADMIN: {
    ROOT: '/admin',
  },

  ERROR: {
    UNAUTHORIZED: '/unauthorized',
  },
} as const;

export const routeHelpers = {
  projectDetails: (id: string) => `/projects/${id}`,
  projectSettings: (id: string) => `/projects/${id}/settings`,
};
