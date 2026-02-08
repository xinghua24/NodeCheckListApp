# Plan: Node.js Daily Checklist Web App

**TL;DR:** Build a full-stack Node.js checklist app with Express backend + React frontend in a single folder. SQLite stores daily task templates and today's task instances. Users create/modify/delete daily task templates, which automatically generate today's tasks. Users check off today's tasks, see instant UI updates, and get congratulated when all items for the day are complete. Simple `npm start` runs everything.

**Architecture:**
- **Backend:** Express.js server with REST API for daily task template CRUD and task instance checking
- **Frontend:** React app with task management and daily checklist UI
- **Database:** SQLite file-based database with two main tables: daily task templates and task instances
- **Structure:** Monorepo (server.js at root, React app in /src, database in /db)
- **Workflow:** Users define daily task templates → system generates today's tasks from templates → users check off today's tasks

---

## Implementation Steps

1. **Initialize project & install dependencies**
   - Create `package.json` with Express, React, sqlite3, and dev tools (concurrently for running both backend + frontend)
   - Create `.gitignore`, `.env.example`

2. **Set up folder structure**
   - Root: `server.js`, `package.json`, `.env`
   - `/src` - React app (components, App.js, index.jsx)
   - `/public` - Static assets (index.html, styles)
   - `/db` - SQLite database file and schema initialization

3. **Create SQLite database schema**
   - Table: `daily_tasks` - Task templates with columns: `id`, `title`, `description`, `created_at`, `updated_at`
   - Table: `task_instances` - Today's tasks with columns: `id`, `daily_task_id`, `date` (YYYY-MM-DD), `completed` (boolean), `created_at`
   - Database initialization script in `/db/init.js`
   - Auto-generate today's tasks from daily_tasks table if not already generated for that date

4. **Build Express backend**
   - **Daily Task Management:**
     - `GET /api/daily-tasks` - Fetch all daily task templates
     - `POST /api/daily-tasks` - Create a new daily task template
     - `POST /api/daily-tasks/:id` - Update a daily task template
     - `DELETE /api/daily-tasks/:id` - Delete a daily task template
   - **Task Instances (Today's Tasks):**
     - `GET /api/tasks/:date` - Fetch task instances for a specific date
     - `POST /api/tasks/:id` - Mark task instance as completed
   - Serve React static files from `/public`
   - Auto-generate today's task instances when date endpoint is called for first time that day

5. **Build React components**
   - `App.js` - Main component, routes between task management and daily checklist
   - `DailyTaskManager.js` - Create, edit, delete daily task templates (shown on settings/management page)
   - `DailyTaskForm.js` - Form to add/edit daily task templates
   - `DailyChecklist.js` - Displays current date and list of task instances for that day
   - `TaskItem.js` - Individual task instance with checkbox, task text
   - `Congratulations.js` - Modal/message shown when all task instances checked

6. **Implement frontend logic**
   - **Task Management Page:**
     - Load daily task templates on page load
     - Add/edit/delete daily task templates → API calls to update templates
     - Changes to daily tasks do not affect already-generated today's tasks
   - **Daily Checklist Page:**
     - Load task instances for today on page load
     - Toggle checkbox → POST API call → update local state
     - Check if all task instances completed → show congratulations message
     - Navigation between dates to view historical task instances

7. **Configure npm scripts**
   - `npm start` - Uses concurrently to run both Express server (port 5000) and React dev server (port 3000)
   - Backend serves static React build and API endpoints

---

## Verification Checklist

- [ ] Run `npm start` → both servers start without errors
- [ ] Open http://localhost:3000 → see daily checklist for today
- [ ] No daily tasks exist initially → today's checklist is empty
- [ ] Go to Task Management page, create daily task templates
- [ ] Refresh daily checklist → today's tasks automatically generated from templates
- [ ] Check off a task → updates in real-time
- [ ] Check all tasks → congratulations message appears
- [ ] Next day, check http://localhost:3000 → new task instances generated
- [ ] Edit/delete daily task template → does not affect already-generated task instances
- [ ] Refresh page → task instances persist (from SQLite)

---

## Key Design Decisions

- **Single process:** Using `concurrently` npm package to run Express + React dev server together with `npm start` (simple setup)
- **Two-tier task system:** Separate daily task templates (user-managed) from task instances (date-specific, auto-generated)
- **SQLite:** File-based DB in `/db/checklist.db` for easy portability
- **Auto-generation:** Task instances are created once per date from daily task templates
- **Independence:** Modifying daily task templates does not affect already-generated task instances
- **API design:** RESTful endpoints for daily task CRUD and task instance checking
- **Congratulations:** Show immediately when last task instance checked, stays visible until day changes or page refresh
