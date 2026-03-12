import { COLORS } from '../../theme/colors';

export type Status = 'todo' | 'in_progress' | 'review' | 'done';

export type Task = {
  _id: string;
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
  todo: COLORS.light.status.todo,
  in_progress: COLORS.light.status.in_progress,
  review: COLORS.light.status.review,
  done: COLORS.light.status.done,
};

import type { TaskPriority } from '../../types.ts';

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  critical: '#d32f2f',
  high: '#f57c00',
  medium: '#0288d1',
  low: '#757575',
};
