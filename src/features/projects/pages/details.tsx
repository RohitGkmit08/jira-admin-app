import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import type { DragEndEvent } from '@dnd-kit/core';

import PageContainer from '../../../components/common/page-container';
import AppDialog from '../../../components/common/app-dialog';
import DndContextWrapper from '../../../components/common/dnd-context';
import FormActions from '../../../components/common/form-actions';
import DraggableTask from '../components/draggable-task';
import DroppableColumn from '../components/droppable-column';
import { COLORS } from '../../../theme/colors';
import { COLUMNS, type Task, type Status } from '../constants';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../../services/task.service';

export default function ProjectDetailsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { enqueueSnackbar } = useSnackbar();

  const muiTheme = useTheme();
  const theme = muiTheme.palette.mode === 'dark' ? COLORS.dark : COLORS.light;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  const [saveTaskLoading, setSaveTaskLoading] = useState(false);

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
        setTasksLoading(true);
        const data = await getTasks(projectId);
        setTasks(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load tasks';
        enqueueSnackbar(message, { variant: 'error' });
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, enqueueSnackbar]);

  const handleCreate = async () => {
    if (!taskTitle.trim() || !projectId) return;

    try {
      setCreateTaskLoading(true);
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
      enqueueSnackbar('Task added', { variant: 'success' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to add task';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setCreateTaskLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      enqueueSnackbar('Task deleted', { variant: 'success' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete task';
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  const handleDetailSave = async () => {
    if (!selectedTask) return;

    try {
      setSaveTaskLoading(true);
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
      enqueueSnackbar('Task updated', { variant: 'success' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update task';
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setSaveTaskLoading(false);
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
      enqueueSnackbar('Status updated', { variant: 'success' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update status';
      enqueueSnackbar(message, { variant: 'error' });
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
          {tasksLoading ? (
            <Box
              sx={{
                gridColumn: '1 / -1',
                py: 6,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            COLUMNS.map((col) => {
              const columnTasks = tasks.filter(
                (task) => task.status === col.id,
              );

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
            })
          )}
        </Box>
      </DndContextWrapper>

      <AppDialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Add task to ${selectedStatus}`}
        actions={
          <FormActions
            onCancel={() => setOpen(false)}
            submitLabel="Create"
            onSubmit={handleCreate}
            loading={createTaskLoading}
            disabled={!taskTitle.trim()}
          />
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
      <AppDialog
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        title="Task Details"
        actions={
          <FormActions
            onCancel={() => setSelectedTask(null)}
            submitLabel="Save"
            onSubmit={handleDetailSave}
            loading={saveTaskLoading}
            disabled={!editedTitle.trim()}
          />
        }
      >
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
      </AppDialog>
    </PageContainer>
  );
}
