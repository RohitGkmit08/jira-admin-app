import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import CloseIcon from '@mui/icons-material/Close';

import PageContainer from '../../../components/common/page-container';
import AppDialog from '../../../components/common/app-dialog';
import DndContextWrapper from '../../../components/common/dnd-context';
import { COLORS } from '../../../constants/theme';
import { COLUMNS, STATUS_COLORS, type Task, type Status } from '../constants';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../../services/task.service';

export default function ProjectDetailsPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const muiTheme = useTheme();
  const theme = muiTheme.palette.mode === 'dark' ? COLORS.dark : COLORS.light;

  const [tasks, setTasks] = useState<Task[]>([]);

  const [open, setOpen] = useState(false);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const [selectedStatus, setSelectedStatus] = useState<Status>('todo');

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
      try {
        const data = await getTasks(projectId);
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, [projectId]);

  const handleCreate = async () => {
    if (!taskTitle.trim() || !projectId) return;

    try {
      const newTask = await createTask({
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        projectId,
        status: selectedStatus,
      });

      setTasks((prev) => [...prev, newTask]);

      setTaskTitle('');
      setTaskDescription('');
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDetailSave = async () => {
    if (!selectedTask) return;

    try {
      const updatedTask = await updateTask(selectedTask._id, {
        title: editedTitle,
        description: editedDescription,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === selectedTask._id ? updatedTask : task,
        ),
      );

      setSelectedTask(null);
      setEditedTitle('');
      setEditedDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;

    const task = tasks.find((task) => task._id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      const updatedTask = await updateTask(taskId, {
        status: newStatus,
      });

      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const activeTask = tasks.find((task) => task._id === activeId);

  return (
    <PageContainer title="Project Board">
      <DndContextWrapper
        onDragStart={(id) => setActiveId(id)}
        onDragEnd={async (event) => {
          await handleDragEnd(event);
          setActiveId(null);
        }}
        overlay={
          activeTask ? (
            <Paper sx={{ px: 2, py: 1.5 }}>{activeTask.title}</Paper>
          ) : null
        }
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 3,
          }}
        >
          {COLUMNS.map((col) => {
            const columnTasks = tasks.filter((task) => task.status === col.id);

            return (
              <DroppableColumn
                key={col.id}
                col={col}
                tasks={tasks}
                theme={theme}
                onAddTask={() => {
                  setSelectedStatus(col.id);
                  setOpen(true);
                }}
              >
                {columnTasks.map((task) => (
                  <DraggableTask
                    key={task._id}
                    task={task}
                    theme={theme}
                    activeId={activeId}
                    onDelete={handleDelete}
                    onClick={(task) => {
                      setSelectedTask(task);
                      setEditedTitle(task.title);
                      setEditedDescription(task.description || '');
                    }}
                  />
                ))}
              </DroppableColumn>
            );
          })}
        </Box>
      </DndContextWrapper>

      <AppDialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Add task to ${selectedStatus}`}
        actions={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!taskTitle.trim()}
            >
              Create
            </Button>
          </>
        }
      >
        <TextField
          fullWidth
          label="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </AppDialog>
      <Dialog
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Task Details</DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSelectedTask(null)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleDetailSave}
            disabled={!editedTitle.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}

type DroppableColumnProps = {
  col: { id: Status; title: string };
  tasks: Task[];
  children: React.ReactNode;
  onAddTask: () => void;
  theme: typeof COLORS.light;
};

function DroppableColumn({
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
        minHeight: 450,
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

type DraggableTaskProps = {
  task: Task;
  theme: typeof COLORS.light;
  activeId: string | null;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
};

function DraggableTask({
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
              sx={{
                fontSize: 11,
                color: theme.textSecondary,
                mt: 0.5,
              }}
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
}
