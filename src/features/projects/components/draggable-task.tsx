import { Paper, Typography, Box, IconButton } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import CloseIcon from '@mui/icons-material/Close';

import { COLORS } from '../../../constants/theme';
import { STATUS_COLORS, type Task } from '../constants';

type Props = {
  task: Task;
  index: number;
  theme: typeof COLORS.light;
  onDelete: (taskId: string) => void;
  onClick: (task: Task) => void;
};

export function DraggableTask({
  task,
  index,
  theme,
  onDelete,
  onClick,
}: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const accentColor = STATUS_COLORS[task.status];

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      sx={{
        p: 1.5,
        borderRadius: '6px',
        backgroundColor: 'background.paper',
        border: `1px solid ${theme.border}`,
        borderLeft: `3px solid ${accentColor}`,
        boxShadow: 'none',
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        cursor: 'grab',
        position: 'relative',
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
        }}
      >
        <CloseIcon sx={{ fontSize: 14 }} />
      </IconButton>

      <Box {...listeners} onClick={() => onClick(task)}>
        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
          {task.title}
        </Typography>

        <Typography sx={{ fontSize: 11, color: theme.textSecondary }}>
          PROJ-{index + 1}
        </Typography>
      </Box>
    </Paper>
  );
}
