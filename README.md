# Jira Task Manager

A **multi-project, role-based task management system** inspired by Jira, built with a scalable architecture and strict workflow control.

---

## Features Overview

- Multi-project support
- Role-based access control (RBAC)
- Kanban board with drag & drop
- Strict task workflow (state machine)
- Project-level permissions

---

## System Architecture
```
User (with role)
  ↓
Performs action
  ↓
Validated by:
  - RBAC rules
  - Workflow rules
  ↓
Task updated
```

---

## Roles & Permissions

### Roles (Project-level)
```ts
type Role = "admin" | "member";
```

### Admin
- Full system access
- Create/Delete project
- Add/Remove members
- Assign roles
- Create/Edit/Delete any task
- Move tasks across any state

### Member
- View tasks
- Edit tasks
- Move tasks within workflow
- Cannot delete projects
- Cannot manage users

---

## Project System

### Features
- Create project
- List projects
- Enter project (board view)
- Manage project settings

### Rules
- Users can belong to multiple projects
- Roles are project-specific
- A user may have different roles across projects

---

## Task System

### Task Schema
```ts
Task {
  id
  title
  description
  status
  priority
  projectId
  owner
  createdAt
  updatedAt
}
```

### Features
- Create tasks
- Edit tasks
- Delete tasks
- Change status
- Set priority
- Drag & drop between columns

---

## Workflow (State Machine)

### States
```
todo → in_progress → review → done
```

### Allowed Transitions
```ts
const ALLOWED_TRANSITIONS = {
  todo: ["in_progress"],
  in_progress: ["todo", "review"],
  review: ["todo", "done"],
  done: [],
};
```

### Rules
- No skipping states
- Backward movement allowed only if defined
- `done` state is locked
- Validation occurs on both frontend and backend

---

## Drag & Drop

### Features
- Move tasks across columns
- Reorder tasks
- Real-time board updates

### Flow
1. Drag task
2. Detect destination column
3. Validate transition
4. Update UI (optimistic update)
5. Persist change via API
6. Revert if invalid

---

## Authentication

### Features
- Login / Logout
- JWT-based authentication
- Protected routes

---

## Authorization (RBAC)

### Checks
- Task creation
- Task updates
- Task deletion
- Task movement
- Project access

### Logic
```
Admin  → full access
Member → limited actions
```

---

## Relationships
```
User    ↔ Project  →  Many-to-many
Project →  Task    →  One-to-many
User    →  Task    →  owner
```

---

## Backend Architecture

### Stack
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

### Responsibilities
- Authentication
- Authorization (RBAC)
- Workflow validation
- Task CRUD operations
- Project management
- Data integrity enforcement

---

## Frontend Architecture
```
React UI Components
   ↓
Hooks (state + logic)
   ↓
Services (API layer)
   ↓
Express Backend
   ↓
MongoDB
```

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Material UI
- dnd-kit (drag & drop)

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication

---

## Edge Cases

- User removed from project → access revoked
- Task in `done` → locked state
- Invalid drag operation → revert UI
- Unauthorized action → blocked by RBAC
- Same user can have different roles in different projects

---

## Project Structure
```
frontend/
  src/
    components/
    features/
      projects/
      board/
      login/
    services/
    router/
    theme/

backend/
  src/
    controllers/
    models/
    routes/
    middleware/
```

---

## Future Improvements

- Activity log
- Task comments
- File attachments
- Notifications
- Advanced filtering
- Search across projects