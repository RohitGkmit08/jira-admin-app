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
} as const;

export const routeHelpers = {
  projectDetails: (id: string) =>
    ROUTES.APP.PROJECT_DETAILS.replace(':projectId', id),
};
