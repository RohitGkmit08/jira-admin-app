#  Jira Task Manager

A **multi-project, role-based task management system** inspired by Jira, built with a scalable architecture, strict workflow control, and audit tracking.

---

## Features Overview

* Multi-project support
* Role-based access control (RBAC)
* Kanban board with drag & drop
* Strict task workflow (state machine)
* Activity logging (audit trail)

---

## System Architecture

```
User (with role)
   ↓
Performs action
   ↓
Validated by:
   - Workflow rules
   ↓
Task updated
   ↓
Activity logged
```

---

## Roles & Permissions

### Roles (Project-level)

```ts
type Role = "admin" | "project_manager" | "member";
```

###  Admin

* Full access
* Create/Delete project
* Add/Remove members
* Assign roles
* View all activity logs
* Create/Edit/Delete any task
* Move tasks (can override transitions if allowed)

###  Project Manager

* Full task control
* Assign/unassign users
* Move tasks (must follow workflow)
* View all project data
* Cannot manage roles or members

###  Member

* View tasks
* Edit own/assigned tasks
* Limited task movement
* Cannot delete tasks
* Cannot manage users

---

##  Project System

### Features

* Create project
* List projects
* Enter project (board view)
* Add/remove users
* Assign roles per project

### Rules

* Users can belong to multiple projects
* Roles are project-specific (same user can have different roles across projects)

---

## Task System

### Schema

```ts
Task {
  id
  title
  description
  status
  priority
  assigneeId
  labels[]
  dueDate
  order

  projectId

  createdBy
  updatedBy

  createdAt
  updatedAt
  deleted
}
```

### Features

* Create / Edit / Delete tasks (soft delete)
* Assign users
* Set priority, labels, due date
* Reorder tasks (drag & drop)

---

##  Workflow (State Machine)

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

* No skipping states
* Backward movement only if defined
* `done` is locked
* Validated on frontend (UX) and backend (strict)

---

## Drag & Drop

### Features

* Move tasks across columns
* Reorder within column
* Visual validation (valid/invalid drops)

### Flow

1. Drag task
2. Detect target column
3. Validate transition
4. Update UI (optimistic)
5. Persist via backend
6. Revert if invalid

---

##  Authentication

### Features

* Login / Logout
* JWT-based session
* Current user context

---

##  Authorization (RBAC)

### Checks

* Edit/Delete task
* Move task
* Assign users
* Manage project members

### Example Logic

```ts
Admin → full access
PM → full task control
Member → limited access
```

---

## Activity Log

### Purpose

* Track all system actions
* Enable audit and monitoring

### Schema

```ts
ActivityLog {
  id
  projectId
  taskId?
  userId
  action
  from?
  to?
  metadata?
  createdAt
}
```

### Actions

* TASK_CREATED
* TASK_UPDATED
* TASK_DELETED
* STATUS_CHANGED
* ASSIGNED
* UNASSIGNED
* PROJECT_CREATED
* MEMBER_ADDED
* ROLE_UPDATED

### Features

* View logs per project
* Admin can view all logs
* Filter by user, task, date

---

## Relationships

* User ↔ Project → Many-to-many (`ProjectUser`)
* Project → Task → One-to-many
* Task → ActivityLog → One-to-many
* User → Task → via `assigneeId`

---

## Backend (Strapi)

### Responsibilities

* Authentication (JWT)
* Role validation (project-level RBAC)
* Transition validation (workflow rules)
* CRUD operations
* Activity logging
* Data integrity

### Notes

* Uses **auto-generated CRUD APIs** from Strapi collections
* Extended with **custom controllers/services** for:

  * task transitions
  * role-based actions
  * activity logging

---

##  Frontend Architecture

```
UI Components
   ↓
Hooks (React Query + logic)
   ↓
Services (API layer)
   ↓
Backend (Strapi)
```

---

## Edge Cases

* User removed from project → loses access
* Task in `done` → locked
* Invalid drag → revert
* Soft-deleted tasks hidden from UI
* Same user → different roles per project
