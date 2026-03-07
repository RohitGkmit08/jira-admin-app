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
import { useSnackbar } from 'notistack';
import type { DragEndEvent } from '@dnd-kit/core';
import SettingsIcon from '@mui/icons-material/Settings';

import PageContainer from '../../../components/common/page-container';
import PageHeader from '../../../components/common/page-header';
import AppDialog from '../../../components/common/app-dialog';
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
import { getMembers } from '../../../services/member.service';
import { routeHelpers } from '../../../constants/routes';
import type {
  ITask,
  TaskPriority,
  TaskType,
  IProjectMember,
} from '../../../types';

const PRIORITY_OPTIONS: TaskPriority[] = ['critical', 'high', 'medium', 'low'];
const TYPE_OPTIONS: TaskType[] = ['task', 'bug', 'story', 'subtask'];

export default function ProjectDetailsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const muiTheme = useTheme();
  const theme = muiTheme.palette.mode === 'dark' ? COLORS.dark : COLORS.light;

  const [tasks, setTasks] = useState<ITask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const [members, setMembers] = useState<IProjectMember[]>([]);

  // Create task state
  const [open, setOpen] = useState(false);
  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status>('todo');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskType, setTaskType] = useState<TaskType>('task');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Edit task state
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [saveTaskLoading, setSaveTaskLoading] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPriority, setEditedPriority] = useState<TaskPriority>('medium');
  const [editedType, setEditedType] = useState<TaskType>('task');
  const [editedAssignee, setEditedAssignee] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        setTasksLoading(true);
        const [tasksData, membersData] = await Promise.all([
          getTasks(projectId),
          getMembers(projectId),
        ]);
        setTasks(tasksData);
        setMembers(membersData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load board';
        enqueueSnackbar(message, { variant: 'error' });
      } finally {
        setTasksLoading(false);
      }
    };

    fetchData();
  }, [projectId, enqueueSnackbar]);

  const resetCreateForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskType('task');
    setTaskAssignee('');
    setTaskDueDate('');
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
        type: taskType,
        assignee: taskAssignee || undefined,
        dueDate: taskDueDate || undefined,
      });

      setTasks((prev) => [...prev, newTask]);
      resetCreateForm();
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

  const openEditDialog = (task: ITask) => {
    setSelectedTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description ?? '');
    setEditedPriority(task.priority);
    setEditedType(task.type);
    setEditedAssignee(
      typeof task.assignee === 'object' && task.assignee
        ? task.assignee._id
        : ''
    );
    setEditedDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    );
  };

  const handleDetailSave = async () => {
    if (!selectedTask) return;

    try {
      setSaveTaskLoading(true);
      const updatedTask = await updateTask(selectedTask._id, {
        title: editedTitle,
        description: editedDescription,
        priority: editedPriority,
        type: editedType,
        assignee: editedAssignee || null,
        dueDate: editedDueDate || null,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === selectedTask._id ? updatedTask : task,
        ),
      );

      setSelectedTask(null);
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
      const updatedTask = await updateTask(taskId, { status: newStatus });
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

  // Reusable task form fields
  const renderTaskFields = (
    title: string,
    setTitle: (v: string) => void,
    description: string,
    setDescription: (v: string) => void,
    priority: TaskPriority,
    setPriority: (v: TaskPriority) => void,
    type: TaskType,
    setType: (v: TaskType) => void,
    assignee: string,
    setAssignee: (v: string) => void,
    dueDate: string,
    setDueDate: (v: string) => void,
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

      {/* Type + Priority row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value as TaskType)}
          >
            {TYPE_OPTIONS.map((t) => (
              <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

      {/* Assignee + Due date row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Assignee</InputLabel>
          <Select
            value={assignee}
            label="Assignee"
            onChange={(e) => setAssignee(e.target.value)}
          >
            <MenuItem value="">
              <em>Unassigned</em>
            </MenuItem>
            {members.map((m) => (
              <MenuItem key={m.userId} value={m.userId}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Box>
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
      <AppDialog
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
          taskTitle, setTaskTitle,
          taskDescription, setTaskDescription,
          taskPriority, setTaskPriority,
          taskType, setTaskType,
          taskAssignee, setTaskAssignee,
          taskDueDate, setTaskDueDate,
        )}
      </AppDialog>

      {/* Edit Task Dialog */}
      <AppDialog
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
          editedTitle, setEditedTitle,
          editedDescription, setEditedDescription,
          editedPriority, setEditedPriority,
          editedType, setEditedType,
          editedAssignee, setEditedAssignee,
          editedDueDate, setEditedDueDate,
        )}
      </AppDialog>
    </PageContainer>
  );
}