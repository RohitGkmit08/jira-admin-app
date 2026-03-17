import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  useTheme,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import type { DragEndEvent } from '@dnd-kit/core';

import PageContainer from '../../../components/common/page-container';
import AppDialog from '../../../components/common/app-dialog';
import DndContextWrapper from '../../../components/common/dnd-context-wrapper';
import { COLORS } from '../../../constants/theme';
import { COLUMNS, type Task, type Status } from '../constants';
import {
  getTasks,
  createTask,
  updateTask,
} from '../../../services/task.service';
import { DroppableColumn } from '../components/droppable-column';
import { DraggableTask } from '../components/draggable-task';

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const muiTheme = useTheme();
  const theme = muiTheme.palette.mode === 'dark' ? COLORS.dark : COLORS.light;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status>('todo');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState(''); // ← added
  const [activeId, setActiveId] = useState<string | null>(null);

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

  const handleDetailClose = () => {
    setSelectedTask(null);
    setEditedTitle('');
    setEditedDescription('');
  };

  const handleDetailSave = async () => {
    if (!selectedTask) return;

    try {
      const updatedTask = await updateTask(selectedTask._id, {
        title: editedTitle,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === selectedTask._id ? updatedTask : task,
        ),
      );

      handleDetailClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      const updatedTask = await updateTask(taskId, { status: newStatus });

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
        onDragEnd={async (event) => {
          await handleDragEnd(event);
          setActiveId(null);
        }}
        overlay={
          activeTask ? (
            <Paper sx={{ p: 1.5, borderRadius: '6px', boxShadow: 6 }}>
              {activeTask.title}
            </Paper>
          ) : null
        }
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
                theme={theme}
                activeId={activeId}
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

      <AppDialog
        open={Boolean(selectedTask)}
        onClose={handleDetailClose}
        title={`PROJ-${selectedTask ? tasks.indexOf(selectedTask) + 1 : ''}`}
        actions={
          <>
            <Button onClick={handleDetailClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleDetailSave}
              disabled={!editedTitle.trim()}
            >
              Save
            </Button>
          </>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            fullWidth
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Add a description..."
          />
        </Box>
      </AppDialog>
    </PageContainer>
  );
}
