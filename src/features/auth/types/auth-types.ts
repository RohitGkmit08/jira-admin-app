export type Role = 'admin' | 'project_manager' | 'member';

export interface LoginFormState {
  email: string;
  password: string;
}

export interface LoginFormError {
  email: string;
  password: string;
}
