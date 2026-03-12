import type { Status } from './features/projects/constants';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskType = 'task' | 'bug' | 'story' | 'subtask';

export type ITask = {
  _id: string;
  title: string;
  description?: string;
  status: Status;
  priority?: TaskPriority;
  type?: TaskType;
  assignee?: { _id: string; name: string } | string | null;
  dueDate?: string | null;
  taskKey?: string;
};
