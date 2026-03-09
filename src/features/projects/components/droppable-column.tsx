import { Box, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { Children } from 'react';

import { ALLOWED_TRANSITIONS, type Task, type Status } from '../constants';

type Props = {
  col: { id: Status; title: string };
  tasks: Task[];
  activeId: string | null;
  children: React.ReactNode;
  onAddTask: () => void;
};

export function DroppableColumn({
  col,
  tasks,
  activeId,
  children,
  onAddTask,
}: Props) {
  const { setNodeRef } = useDroppable({ id: col.id });

  const activeTask = tasks.find((task) => task.id === activeId);

  let isValid = false;
  if (activeTask) {
    isValid = ALLOWED_TRANSITIONS[activeTask.status].includes(col.id);
  }

  const columnTaskCount = tasks.filter((t) => t.status === col.id).length;

  return (
    <Box ref={setNodeRef}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
          {col.title}
        </Typography>

        <Typography sx={{ fontSize: 12 }}>{columnTaskCount}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {Children.count(children) === 0 ? (
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
            No tasks
          </Typography>
        ) : (
          children
        )}
      </Box>

      {col.id !== 'done' && (
        <Box
          onClick={onAddTask}
          sx={{
            mt: 1.5,
            cursor: 'pointer',
          }}
        >
          <Typography sx={{ fontSize: 12 }}>+ Add task</Typography>
        </Box>
      )}
    </Box>
  );
}
