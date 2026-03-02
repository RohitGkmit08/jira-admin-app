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
import {
  COLUMNS,
  ALLOWED_TRANSITIONS,
  STATUS_COLORS,
  type Task,
  type Status,
} from '../constants';
import { getTasks, createTask } from '../../../services/task.service';

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const muiTheme = useTheme();
  const theme = muiTheme.palette.mode === 'dark' ? COLORS.dark : COLORS.light;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status>('todo');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

<<<<<<< HEAD
=======
  // Fetch tasks
>>>>>>> 6f83ed0 (fix: address PR review comments in auth flow and project details page)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(projectId!);
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, [projectId]);

<<<<<<< HEAD
=======
  // Create task with status
>>>>>>> 6f83ed0 (fix: address PR review comments in auth flow and project details page)
  const handleCreate = async () => {
    if (!taskTitle.trim()) return;

    try {
      const newTask = await createTask({
        title: taskTitle.trim(),
        projectId: projectId!,
        status: selectedStatus,
      });

      setTasks((prev) => [...prev, newTask]);
      setTaskTitle('');
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task._id !== taskId));
  };

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
  };

  const handleDetailClose = () => {
    setSelectedTask(null);
    setEditedTitle('');
    setEditedDescription('');
  };

  const handleDetailSave = () => {
    if (!selectedTask) return;

    setTasks((prev) =>
      prev.map((task) =>
        task._id === selectedTask._id
          ? { ...task, title: editedTitle, description: editedDescription }
          : task,
      ),
    );

    handleDetailClose();
  };

<<<<<<< HEAD
=======
  // Drag logic (UI only for now)
>>>>>>> 6f83ed0 (fix: address PR review comments in auth flow and project details page)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;

    setTasks((prev) =>
      prev.map((task) => {
        if (task._id !== taskId) return task;
        if (!ALLOWED_TRANSITIONS[task.status].includes(newStatus)) return task;
        return { ...task, status: newStatus };
      }),
    );
  };

  return (
    <PageContainer title="Project Board">
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: theme.textSecondary,
          mb: 3,
        }}
      >
        Project: {projectId}
      </Typography>

      <DndContextWrapper
        onDragStart={(id) => setActiveId(id)}
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
          }}
        >
          {COLUMNS.map((col) => {
            const columnTasks = tasks.filter((task) => task.status === col.id);

            return (
              <DroppableColumn
                key={col.id}
                col={col}
                tasks={tasks}
                activeId={activeId}
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
                    onDelete={handleDelete}
                    onClick={handleCardClick}
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
        title={`Add task to ${COLUMNS.find((col) => col.id === selectedStatus)?.title}`}
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
        />
      </AppDialog>

      <Dialog
        open={Boolean(selectedTask)}
        onClose={handleDetailClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: theme.textSecondary,
              }}
            >
              PROJ-{tasks.indexOf(selectedTask!) + 1}
            </Typography>

            <Box
              sx={{
                backgroundColor: selectedTask
                  ? STATUS_COLORS[selectedTask.status]
                  : 'transparent',
                borderRadius: '4px',
                px: 1,
                py: 0.3,
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'common.white',
                  textTransform: 'uppercase',
                }}
              >
                {selectedTask?.status.replace('_', ' ')}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose}>Cancel</Button>
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
  activeId: string | null;
  children: React.ReactNode;
  onAddTask: () => void;
  theme: typeof COLORS.light;
};

function DroppableColumn({
  col,
  tasks,
  activeId,
  children,
  onAddTask,
  theme,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  const activeTask = tasks.find((task) => task._id === activeId);

  let isValid = false;
  if (activeTask) {
    isValid = ALLOWED_TRANSITIONS[activeTask.status].includes(col.id);
  }

  const isDragOver = isOver && activeTask;
  const accentColor = STATUS_COLORS[col.id];
  const columnTaskCount = tasks.filter((t) => t.status === col.id).length;

  return (
    <Box
      ref={setNodeRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.columnBg,
        borderRadius: '8px',
        border: `1px solid ${
          isDragOver
            ? isValid
              ? COLORS.dragValid
              : COLORS.dragInvalid
            : theme.border
        }`,
        borderTop: `3px solid ${accentColor}`,
        transition: 'border-color 0.15s ease',
        minWidth: 0,
      }}
    >
      <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 1 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: theme.textSecondary,
          }}
        >
          {col.title}
        </Typography>

        <Typography fontSize={11} color={theme.textSecondary}>
          {columnTaskCount}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, p: 1.5 }}>{children}</Box>

      {col.id !== 'done' && (
        <Box sx={{ p: 1.5 }}>
          <Button onClick={onAddTask} fullWidth>
            + Add Task
          </Button>
        </Box>
      )}
    </Box>
  );
}

type DraggableTaskProps = {
  task: Task;
  theme: typeof COLORS.light;
  onDelete: (id: string) => void;
  onClick: (task: Task) => void;
};

function DraggableTask({ task, theme, onDelete, onClick }: DraggableTaskProps) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: task._id,
  });

  const accentColor = STATUS_COLORS[task.status];

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        p: 1.5,
        borderRadius: '6px',
        backgroundColor: 'background.paper',
        border: `1px solid ${theme.border}`,
        borderLeft: `3px solid ${accentColor}`,
        mb: 1.5,
        cursor: 'grab',
        '&:hover': {
          boxShadow: theme.shadow,
        },
      }}
    >
      <Typography
        onClick={() => onClick(task)}
        sx={{
          fontSize: 13,
          fontWeight: 500,
          color: theme.textPrimary,
        }}
      >
        {task.title}
      </Typography>

      <IconButton
        size="small"
        onClick={() => onDelete(task._id)}
        sx={{ float: 'right' }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Typography fontSize={11} color={theme.textSecondary}>
        PROJ-{1}
      </Typography>
    </Paper>
  );
}