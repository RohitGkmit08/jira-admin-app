import { Box, Typography, Paper, IconButton } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import CloseIcon from '@mui/icons-material/Close';

import { COLORS } from '../../../theme/colors';
import { STATUS_COLORS, type Task } from '../../projects/constants';

type DraggableTaskProps = {
  task: Task;
  theme: typeof COLORS.light;
  activeId: string | null;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
};

const DraggableTask = ({
  task,
  theme,
  activeId,
  onDelete,
  onClick,
}: DraggableTaskProps) => {
  const { setNodeRef, listeners, attributes } = useDraggable({ id: task._id });
  const accentColor = STATUS_COLORS[task.status];
  const isDragging = activeId === task._id;

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
      <Box display="flex" alignItems="flex-start">
        <Box flex={1}>
          <Typography
            onClick={() => onClick(task)}
            sx={{
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.4,
              cursor: 'pointer',
            }}
          >
            {task.title}
          </Typography>
          {task.description && (
            <Typography
              sx={{ fontSize: 11, color: theme.textSecondary, mt: 0.5 }}
            >
              {task.description}
            </Typography>
          )}
        </Box>
        <IconButton
          size="small"
          onClick={() => onDelete(task._id)}
          sx={{ p: 0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default DraggableTask;
