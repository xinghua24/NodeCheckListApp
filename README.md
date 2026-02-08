# Daily Checklist App

A full-stack Node.js web application for managing daily tasks with task templates and daily instances.

## Features

- **Task Templates**: Create, edit, and delete daily task templates
- **Auto-generation**: Daily tasks are automatically generated from templates
- **Task Tracking**: Check off completed tasks for each day
- **Congratulations**: Get a celebration message when all tasks are complete
- **Date Navigation**: View tasks for any date
- **Persistence**: All data stored in SQLite database

## Architecture

- **Backend**: Express.js REST API (Port 5001)
- **Frontend**: React (Port 3000)
- **Database**: SQLite (file-based)

## Installation

```bash
npm install
```

## Running the Application

Start both the backend server and React development server:

```bash
npm start
```

This will:
- Start Express server on http://localhost:5001
- Start React dev server on http://localhost:3000
- Open your browser to http://localhost:3000

## Usage

1. **Manage Daily Tasks**: Click "Manage Daily Tasks" to create task templates
2. **Add Tasks**: Create new daily task templates with titles and descriptions
3. **View Daily Checklist**: Click "Today's Tasks" to see today's tasks
4. **Check Off Tasks**: Click checkboxes to mark tasks as complete
5. **Complete All**: When all tasks are checked, you'll get a congratulations message

## API Endpoints

### Daily Task Templates
- `GET /api/daily-tasks` - Get all task templates
- `POST /api/daily-tasks` - Create a new task template
- `POST /api/daily-tasks/:id` - Update a task template
- `DELETE /api/daily-tasks/:id` - Delete a task template

### Task Instances
- `GET /api/tasks/:date` - Get task instances for a date (auto-generates if needed)
- `POST /api/tasks/:id` - Update task completion status

## Project Structure

```
NodeCheckListApp/
├── db/
│   ├── init.js              # Database initialization
│   └── checklist.db         # SQLite database (auto-created)
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── components/
│   │   ├── Congratulations.js    # Success message component
│   │   ├── Congratulations.css
│   │   ├── DailyChecklist.js     # Daily task list view
│   │   ├── DailyChecklist.css
│   │   ├── DailyTaskForm.js      # Form for adding/editing templates
│   │   ├── DailyTaskForm.css
│   │   ├── DailyTaskManager.js   # Task template management
│   │   ├── DailyTaskManager.css
│   │   ├── TaskItem.js           # Individual task item
│   │   └── TaskItem.css
│   ├── App.js               # Main app component
│   ├── App.css
│   ├── index.js             # React entry point
│   └── index.css
├── server.js                # Express backend
├── package.json
└── .env                     # Environment variables

```

## Environment Variables

Create a `.env` file (or copy from `.env.example`):

```
PORT=5001
NODE_ENV=development
DB_PATH=./db/checklist.db
```

## Database Schema

### daily_tasks (Templates)
- `id` - Primary key
- `title` - Task title
- `description` - Task description
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### task_instances (Daily Tasks)
- `id` - Primary key
- `daily_task_id` - Foreign key to daily_tasks
- `date` - Date (YYYY-MM-DD)
- `completed` - Boolean (0 or 1)
- `created_at` - Creation timestamp

## Development

Run with auto-reload:

```bash
npm run dev
```

Run backend only:

```bash
npm run server
```

Run frontend only:

```bash
npm run client
```

## License

ISC
