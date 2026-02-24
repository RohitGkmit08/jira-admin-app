export type UserRole = 'admin' | 'project_manager' | 'member';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}
