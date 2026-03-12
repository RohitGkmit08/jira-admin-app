import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  useTheme,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { DragEndEvent } from '@dnd-kit/core';
import SettingsIcon from '@mui/icons-material/Settings';

import PageContainer from '../../../components/common/page-container';
import PageHeader from '../../../components/common/page-header';
import Dialog from '../../../components/common/dialog';
import DndContextWrapper from '../../../components/common/dnd-context';
import FormActions from '../../../components/common/form-actions';
import DraggableTask from '../components/draggable-task';
import DroppableColumn from '../components/droppable-column';
import { COLORS } from '../../../theme/colors';
import { COLUMNS, type Status } from '../constants';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../../services/task.service';
import { routeHelpers } from '../../../constants/routes';
import type { ITask, TaskPriority } from '../../../types.ts';

const PRIORITY_OPTIONS: TaskPriority[] = ['critical', 'high', 'medium', 'low'];

export default function ProjectDetailsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const muiTheme = useTheme();
  const theme = muiTheme.palette.mode === 'dark' ? COLORS.dark : COLORS.light;

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status>('todo');

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');

  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [saveTaskLoading, setSaveTaskLoading] = useState(false);

  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPriority, setEditedPriority] = useState<TaskPriority>('medium');

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        setTasksLoading(true);
        const tasksData = await getTasks(projectId);
        setTasks(tasksData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load board';
        toast.error(message);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const resetCreateForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
  };

  const handleCreate = async () => {
    if (!taskTitle.trim() || !projectId) return;

    try {
      setCreateTaskLoading(true);

      const newTask = await createTask({
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        projectId,
        status: selectedStatus,
        priority: taskPriority,
      });

      setTasks((prev) => [...prev, newTask]);

      resetCreateForm();
      setOpen(false);

      toast.success('Task added');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add task';
      toast.error(message);
    } finally {
      setCreateTaskLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);

      setTasks((prev) => prev.filter((task) => task._id !== taskId));

      toast.success('Task deleted');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete task';
      toast.error(message);
    }
  };

  const openEditDialog = (task: ITask) => {
    setSelectedTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description ?? '');
    setEditedPriority(task.priority || 'medium');
  };

  const handleDetailSave = async () => {
    if (!selectedTask) return;

    try {
      setSaveTaskLoading(true);

      const updatedTask = await updateTask(selectedTask._id, {
        title: editedTitle,
        description: editedDescription,
        priority: editedPriority,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === selectedTask._id ? updatedTask : task,
        ),
      );

      setSelectedTask(null);

      toast.success('Task updated');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update task';
      toast.error(message);
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
      const updatedTask = await updateTask(taskId, { status: newStatus });

      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task)),
      );

      toast.success('Status updated');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update status';
      toast.error(message);
    }
  };

  const activeTask = tasks.find((task) => task._id === activeId);

  const renderTaskFields = (
    title: string,
    setTitle: (v: string) => void,
    description: string,
    setDescription: (v: string) => void,
    priority: TaskPriority,
    setPriority: (v: TaskPriority) => void,
  ) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <TextField
        fullWidth
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        InputLabelProps={{ shrink: true }}
        autoFocus
      />

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      <FormControl fullWidth size="small">
        <InputLabel>Priority</InputLabel>

        <Select
          value={priority}
          label="Priority"
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          {PRIORITY_OPTIONS.map((p) => (
            <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <PageContainer title="Project Board">
      <PageHeader
        title="Project Board"
        action={
          <IconButton
            onClick={() => navigate(routeHelpers.projectSettings(projectId!))}
            size="small"
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        }
      />

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
            minWidth: 0,
            overflowX: 'hidden',
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
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
                      onClick={openEditDialog}
                    />
                  ))}
                </DroppableColumn>
              );
            })
          )}
        </Box>
      </DndContextWrapper>

      {/* Create Task Dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetCreateForm();
        }}
        title={`Add task to ${selectedStatus}`}
        actions={
          <FormActions
            onCancel={() => {
              setOpen(false);
              resetCreateForm();
            }}
            submitLabel="Create"
            onSubmit={handleCreate}
            loading={createTaskLoading}
            disabled={!taskTitle.trim()}
          />
        }
      >
        {renderTaskFields(
          taskTitle,
          setTaskTitle,
          taskDescription,
          setTaskDescription,
          taskPriority,
          setTaskPriority,
        )}
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.taskKey ?? 'Task Details'}
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
        {renderTaskFields(
          editedTitle,
          setEditedTitle,
          editedDescription,
          setEditedDescription,
          editedPriority,
          setEditedPriority,
        )}
      </Dialog>
    </PageContainer>
  );
}
