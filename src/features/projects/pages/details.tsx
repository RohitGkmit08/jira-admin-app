import { useState } from 'react';
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
import { Children } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import PageContainer from '../../../components/common/page-container';
import AppDialog from '../../../components/common/app-dialog';
import DndContextWrapper from '../../../components/common/dnd-context-wrapper';
import { COLORS } from '../../../constants/theme';
import {
  COLUMNS,
  ALLOWED_TRANSITIONS,
  STATUS_COLORS,
  type Task,
  type Status,
} from '../constants';

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
            alignItems: 'stretch',
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
          label="Task Title"
          fullWidth
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          sx={{ mt: 1 }}
          autoFocus
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
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

  const activeTask = tasks.find((task) => task.id === activeId);

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
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: theme.textSecondary,
            textTransform: 'uppercase',
          }}
        >
          {col.title}
        </Typography>

        <Box
          sx={{
            backgroundColor: theme.border,
            borderRadius: '10px',
            px: 1,
            minWidth: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: theme.textSecondary,
            }}
          >
            {columnTaskCount}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: '1px', backgroundColor: theme.border, mx: 2 }} />

      <Box
        sx={{
          px: 1.5,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        {Children.count(children) === 0 ? (
          <Box
            sx={{
              border: `1px dashed ${theme.border}`,
              borderRadius: '6px',
              py: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: 12, color: theme.textSecondary }}>
              No tasks
            </Typography>
          </Box>
        ) : (
          children
        )}
      </Box>

      {col.id !== 'done' && (
        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <Box
            onClick={onAddTask}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.8,
              borderRadius: '6px',
              cursor: 'pointer',
              color: theme.textSecondary,
              '&:hover': {
                backgroundColor: theme.border,
                color: theme.textPrimary,
              },
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 400 }}>+</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
              Add task
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

type DraggableTaskProps = {
  task: Task;
  index: number;
  theme: typeof COLORS.light;
  onDelete: (taskId: string) => void;
  onClick: (task: Task) => void;
};

function DraggableTask({
  task,
  index,
  theme,
  onDelete,
  onClick,
}: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const accentColor = STATUS_COLORS[task.status];

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      sx={{
        p: 1.5,
        borderRadius: '6px',
        backgroundColor: 'background.paper',
        border: `1px solid ${theme.border}`,
        borderLeft: `3px solid ${accentColor}`,
        boxShadow: 'none',
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        cursor: 'grab',
        position: 'relative',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          borderColor: accentColor,
        },
        '&:hover .delete-btn': {
          display: 'flex',
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      {/* Delete Button */}
      <IconButton
        className="delete-btn"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        sx={{
          display: 'none',
          position: 'absolute',
          top: 4,
          right: 4,
          width: 20,
          height: 20,
          color: theme.textSecondary,
          '&:hover': {
            color: COLORS.dragInvalid,
            backgroundColor: 'transparent',
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 14 }} />
      </IconButton>

      {/* Card content */}
      <Box {...listeners} onClick={() => onClick(task)}>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 500,
            color: theme.textPrimary,
            lineHeight: 1.4,
            mb: 1.5,
            pr: 2,
          }}
        >
          {task.title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              color: theme.textSecondary,
            }}
          >
            PROJ-{index + 1}
          </Typography>

          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: accentColor,
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
