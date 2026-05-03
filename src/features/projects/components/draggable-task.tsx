import { Box, Typography, Paper, IconButton, Chip } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import CloseIcon from '@mui/icons-material/Close';

import { COLORS } from '../../../theme/colors';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import type { ITask } from '../../../types.ts';

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

  const accentColor = STATUS_COLORS[task.status as keyof typeof STATUS_COLORS];
  const isDragging = activeId === task._id;

  const priorityColor = PRIORITY_COLORS[task.priority || 'medium'];

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
      {/* Top row */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={0.5}
      >
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
          mb: 0.6,
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

      {/* Priority */}
      <Box display="flex" justifyContent="flex-start">
        <Chip
          label={task.priority || 'medium'}
          size="small"
          sx={{
            fontSize: 10,
            height: 20,
            borderRadius: '6px',
            fontWeight: 600,
            color: priorityColor,
            borderColor: priorityColor,
            textTransform: 'capitalize',
          }}
          variant="outlined"
        />
      </Box>
    </Paper>
  );
}
