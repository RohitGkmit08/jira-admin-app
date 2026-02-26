import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

import PageContainer from '../../../components/common/page-container';

type Status = 'todo' | 'in_progress' | 'review' | 'done';

type Task = {
  id: string;
  title: string;
  status: Status;
};

const columns: { id: Status; title: string }[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

const allowedTransitions: Record<Status, Status[]> = {
  todo: ['in_progress'],
  in_progress: ['review'],
  review: ['in_progress', 'done'],
  done: [],
};

export default function ProjectDetailsPage() {
  const { projectId } = useParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status>('todo');
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleCreate = () => {
    if (!taskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      status: selectedStatus,
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskTitle('');
    setOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;

        if (!allowedTransitions[t.status].includes(newStatus)) {
          return t;
        }

        return { ...t, status: newStatus };
      }),
    );
  };

  return (
    <PageContainer title="Project Board">
      <Typography mb={3} variant="h6" fontWeight={700}>
        Project ID: {projectId}
      </Typography>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={(event) => setActiveId(event.active.id as string)}
        onDragEnd={(event) => {
          handleDragEnd(event);
          setActiveId(null);
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            height: '72vh',
          }}
        >
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id);

            return (
              <DroppableColumn
                key={col.id}
                col={col}
                tasks={tasks}
                activeId={activeId}
                onAddTask={() => {
                  setSelectedStatus(col.id);
                  setOpen(true);
                }}
              >
                {columnTasks.map((task, index) => (
                  <DraggableTask key={task.id} task={task} index={index} />
                ))}
              </DroppableColumn>
            );
          })}
        </Box>
      </DndContext>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create Task</DialogTitle>

        <DialogContent>
          <TextField
            label="Task Title"
            fullWidth
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!taskTitle.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}

function DroppableColumn({
  col,
  tasks,
  activeId,
  children,
  onAddTask,
}: {
  col: { id: Status; title: string };
  tasks: Task[];
  activeId: string | null;
  children: React.ReactNode;
  onAddTask: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  const activeTask = tasks.find((t) => t.id === activeId);

  const isValid =
    activeTask && allowedTransitions[activeTask.status].includes(col.id);

  const bgColor = isOver
    ? isValid
      ? 'success.light'
      : 'error.light'
    : 'grey.100';

  return (
    <Box
      ref={setNodeRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: bgColor,
        borderRadius: 2,
        p: 1,
        height: '100%',
        transition: 'background-color 0.2s ease',
      }}
    >
      <Typography px={1} py={1} fontWeight={600} fontSize={12}>
        {col.title.toUpperCase()}
      </Typography>

      {col.id !== 'done' && (
        <Box px={1} pb={1}>
          <Button
            size="small"
            sx={{ textTransform: 'none', fontSize: 12 }}
            onClick={onAddTask}
          >
            + Add Task
          </Button>
        </Box>
      )}

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          px: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function DraggableTask({ task, index }: { task: Task; index: number }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        p: 1.5,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        cursor: 'grab',
      }}
    >
      <Typography fontSize={14} fontWeight={500}>
        <span style={{ color: '#6b7280' }}>{index + 1}.</span> {task.title}
      </Typography>
    </Paper>
  );
}
