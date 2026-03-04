import { useState } from 'react';
import { Box, Typography, Button, TextField, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import type { DragEndEvent } from '@dnd-kit/core';

import PageContainer from '../../../components/common/page-container';
import AppDialog from '../../../components/common/app-dialog';
import DndContextWrapper from '../../../components/common/dnd-context-wrapper';
import { COLORS } from '../../../constants/theme';
import {
  COLUMNS,
  ALLOWED_TRANSITIONS,
  type Task,
  type Status,
} from '../constants';
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const handleCreate = () => {
    if (!taskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      status: selectedStatus,
      description: '',
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskTitle('');
    setOpen(false);
  };

  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
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
        task.id === selectedTask.id
          ? { ...task, title: editedTitle, description: editedDescription }
          : task,
      ),
    );

    handleDetailClose();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
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
                onAddTask={() => {
                  setSelectedStatus(col.id);
                  setOpen(true);
                }}
              >
                {columnTasks.map((task, index) => (
                  <Box
                    key={task.id}
                    sx={{ opacity: activeId === task.id ? 0 : 1 }}
                  >
                    <DraggableTask
                      task={task}
                      index={index}
                      theme={theme}
                      onDelete={handleDelete}
                      onClick={handleCardClick}
                    />
                  </Box>
                ))}
              </DroppableColumn>
            );
          })}
        </Box>
      </DndContextWrapper>

      <AppDialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Add task to ${
          COLUMNS.find((col) => col.id === selectedStatus)?.title
        }`}
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
          label="Task Title"
          fullWidth
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          sx={{ mt: 1 }}
          autoFocus
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
