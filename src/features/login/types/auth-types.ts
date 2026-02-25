export type Role = 'admin' | 'project_manager' | 'member';

export interface LoginFormValues {
  email: string;
  password: string;
}

export type LoginFormErrors = Partial<LoginFormValues>;
