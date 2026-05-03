import { Box, Typography, Button } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';

import { COLORS } from '../../../theme/colors';
import { STATUS_COLORS, type Status } from '../constants';
import type { ITask } from '../../../types.ts';

type DroppableColumnProps = {
  col: { id: Status; title: string };
  tasks: ITask[];
  children: React.ReactNode;
  onAddTask: () => void;
  theme: typeof COLORS.light;
};

export default function DroppableColumn({
  col,
  tasks,
  children,
  onAddTask,
  theme,
}: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id: col.id });

  const accentColor = STATUS_COLORS[col.id];
  const columnTaskCount = tasks.filter((task) => task.status === col.id).length;

  return (
    <Box
      ref={setNodeRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.columnBg,
        borderRadius: '8px',
        border: `1px solid ${theme.border}`,
        borderTop: `3px solid ${accentColor}`,
        minHeight: { xs: 220, sm: 320, md: 450 },
      }}
    >
      <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
          {col.title}
        </Typography>

        <Typography fontSize={11}>{columnTaskCount}</Typography>
      </Box>

      <Box sx={{ flex: 1, p: 1.5, overflowY: 'auto' }}>{children}</Box>

      <Box sx={{ p: 1.5 }}>
        <Button onClick={onAddTask} fullWidth>
          + Add Task
        </Button>
      </Box>
    </Box>
  );
}
