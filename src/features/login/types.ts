export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export type AuthUser = User;

export interface LoginFormValues {
  email: string;
  password: string;
}

export type LoginFormErrors = {
  email?: string;
  password?: string;
};
