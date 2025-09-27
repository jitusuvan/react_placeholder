# Django Task API - React Frontend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Django Backend
Make sure your Django server is running on `http://localhost:8000`

```bash
cd d:\Project\DesktopProject\CRUD\CRUD\demo
python manage.py runserver
```

### 3. Start React Frontend
```bash
npm run dev
```

## Features Implemented

### ✅ Authentication
- Login form with validation
- JWT token management
- Auto logout functionality
- User profile display

### ✅ Task Management
- Create, Read, Update, Delete tasks
- Task form with validation
- Modal-based task editing

### ✅ Advanced Table Features
- Search functionality
- Filtering by completion status
- Date filtering
- Sorting (newest first, due date, title, etc.)
- Pagination with navigation
- Status indicators (completed, pending, overdue)

### ✅ Redux Integration
- Centralized state management
- Async thunks for API calls
- Error handling
- Loading states

### ✅ Custom Hooks
- `useTaskForm` - Form validation and management
- Redux hooks for type safety

### ✅ Responsive Design
- Mobile-friendly table
- Tailwind CSS styling
- Loading spinners
- Error messages

## API Integration

The app integrates with all Django API endpoints:

- **Authentication**: `/api/token/`, `/api/v1/auth/profile/`
- **Tasks**: `/api/v1/tasks/` (GET, POST, PUT, PATCH, DELETE)
- **Filtering**: Search, completion status, due date, ordering
- **Pagination**: Page-based navigation

## Components Structure

```
src/
├── components/
│   ├── TaskDashboard.tsx    # Main dashboard
│   ├── TaskTable.tsx        # Table with filters
│   ├── TaskForm.tsx         # Create/edit form
│   ├── TaskModal.tsx        # Modal wrapper
│   ├── LoginForm.tsx        # Authentication
│   └── Header.tsx           # Navigation header
├── hooks/
│   └── useTaskForm.ts       # Form validation hook
├── services/
│   └── taskService.ts       # API service
├── store/
│   ├── authSlice.ts         # Auth state
│   ├── taskSlice.ts         # Task state
│   └── store.ts             # Redux store
└── types/
    └── task.ts              # TypeScript interfaces
```

## Usage

1. Login with your Django user credentials
2. View task dashboard with statistics
3. Create new tasks using the "Create New Task" button
4. Filter and search tasks using the table controls
5. Edit tasks by clicking "Edit" in the table
6. Mark tasks as complete/incomplete by clicking status badges
7. Delete tasks using the "Delete" button
8. Navigate through pages if you have more than 10 tasks

The application automatically handles token refresh and logout on authentication errors.