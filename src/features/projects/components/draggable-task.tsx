import {
  Box,
  Typography,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import CloseIcon from '@mui/icons-material/Close';
import BugReportIcon from '@mui/icons-material/BugReport';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import { COLORS } from '../../../theme/colors';
import { STATUS_COLORS } from '../constants';
import type { ITask, TaskPriority, TaskType } from '../../../types';

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  critical: '#d32f2f',
  high: '#f57c00',
  medium: '#0288d1',
  low: '#757575',
};

const TYPE_ICONS: Record<TaskType, React.ReactNode> = {
  task: <TaskAltIcon sx={{ fontSize: 13 }} />,
  bug: <BugReportIcon sx={{ fontSize: 13 }} />,
  story: <BookmarkIcon sx={{ fontSize: 13 }} />,
  subtask: <AccountTreeIcon sx={{ fontSize: 13 }} />,
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const isOverdue = (dueDate?: string | null) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

type DraggableTaskProps = {
  task: ITask;
  theme: typeof COLORS.light;
  activeId: string | null;
  onDelete: (id: string) => void;
  onClick: (task: ITask) => void;
};

export default function DraggableTask({
  task,
  theme,
  activeId,
  onDelete,
  onClick,
}: DraggableTaskProps) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: task._id,
  });

  const accentColor = STATUS_COLORS[task.status];
  const isDragging = activeId === task._id;
  const overdue = isOverdue(task.dueDate);

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      elevation={1}
      sx={{
        px: 1.5,
        py: 1.2,
        borderRadius: '8px',
        border: `1px solid ${theme.border}`,
        borderLeft: `4px solid ${accentColor}`,
        mb: 1.5,
        cursor: 'grab',
        visibility: isDragging ? 'hidden' : 'visible',
      }}
    >
      {/* Top row — type icon + task key + delete */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Tooltip title={task.type}>
            <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
              {TYPE_ICONS[task.type]}
            </Box>
          </Tooltip>

          <Typography fontSize={11} color="text.secondary" fontFamily="monospace">
            {task.taskKey}
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          sx={{ p: 0.3 }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Title */}
      <Typography
        onClick={() => onClick(task)}
        sx={{
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.4,
          cursor: 'pointer',
          mb: 0.5,
          '&:hover': { color: 'primary.main' },
        }}
      >
        {task.title}
      </Typography>

      {/* Description */}
      {task.description && (
        <Typography
          sx={{
            fontSize: 11,
            color: theme.textSecondary,
            mb: 0.8,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.description}
        </Typography>
      )}

      {/* Bottom row — priority + due date + assignee */}
      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
        {/* Priority */}
        <Chip
          label={task.priority}
          size="small"
          sx={{
            fontSize: 10,
            height: 18,
            color: PRIORITY_COLORS[task.priority],
            borderColor: PRIORITY_COLORS[task.priority],
            textTransform: 'capitalize',
          }}
          variant="outlined"
        />

        {/* Due date */}
        {task.dueDate && (
          <Typography
            fontSize={10}
            sx={{ color: overdue ? 'error.main' : 'text.secondary' }}
          >
            {overdue ? '⚠ ' : ''}
            {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
        )}

        {/* Assignee avatar */}
        {task.assignee && (
          <Tooltip title={task.assignee.name} sx={{ ml: 'auto' }}>
            <Avatar sx={{ width: 20, height: 20, fontSize: 10, ml: 'auto' }}>
              {getInitials(task.assignee.name)}
            </Avatar>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
}