import type { Status } from './features/projects/constants';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export type ITask = {
  _id: string;
  title: string;
  description?: string;
  status: Status;
  priority?: TaskPriority;
};
