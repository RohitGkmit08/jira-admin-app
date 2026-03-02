import { COLORS } from '../../constants/theme';

export type Status = 'todo' | 'in_progress' | 'review' | 'done';

export type Task = {
  id: string;
  title: string;
  status: Status;
  description: string;
};

export const COLUMNS: { id: Status; title: string }[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export const ALLOWED_TRANSITIONS: Record<Status, Status[]> = {
  todo: ['in_progress'],
  in_progress: ['review'],
  review: ['in_progress', 'done'],
  done: [],
};

export const STATUS_COLORS: Record<Status, string> = {
  todo: COLORS.light.primary,
  in_progress: '#FF991F',
  review: '#6554C0',
  done: COLORS.dragValid,
};
