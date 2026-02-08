# Daily Checklist App - AI Agent Instructions

## Architecture Overview

This is a **full-stack Node.js + React daily task tracker** using a template-instance pattern:

- **Backend**: Express.js REST API on port 5001 ([server.js](server.js))
- **Frontend**: React SPA on port 3000 ([src/](src/))
- **Database**: SQLite with two core tables ([db/init.js](db/init.js)):
  - `daily_tasks` - Reusable task templates
  - `task_instances` - Daily instances auto-generated from templates

**Critical concept**: Task instances are lazy-generated per date on first access via `generateTaskInstancesForDate()` in [server.js](server.js#L21-L107). Once created for a date, they exist independently—deleting a template does NOT delete existing instances (CASCADE only affects future operations).

## Development Workflow

```bash
npm start          # Runs backend + frontend concurrently (production-like)
npm run dev        # Same but with nodemon for backend auto-restart
npm run server     # Backend only on port 5001
npm run client     # Frontend only on port 3000
```

**Important**: The React app proxies API requests to `http://localhost:5001` via `package.json` proxy config. Backend must run on port 5001 (not the default 5000 in code).

## Database Patterns

**Connection Handling**: This app uses **per-query connections** (open → query → close), not connection pooling:
```javascript
const db = getDatabase();  // Opens new connection
db.all('SELECT ...', [], (err, rows) => {
    db.close();  // ALWAYS close in callback
    // ...
});
```
Never reuse `db` instances across queries. Always call `db.close()` in the callback.

**Schema**: 
- Foreign key `task_instances.daily_task_id → daily_tasks.id ON DELETE CASCADE`
- Unique constraint: `UNIQUE(daily_task_id, date)` prevents duplicate instances per day
- Index on `task_instances.date` for performance

## API Conventions

All endpoints use `/api/` prefix:

**Templates** (daily_tasks table):
- `GET /api/daily-tasks` - List all templates
- `POST /api/daily-tasks` - Create new template
- `POST /api/daily-tasks/:id` - Update template (NOTE: POST, not PUT)
- `DELETE /api/daily-tasks/:id` - Delete template

**Instances** (task_instances table):
- `GET /api/tasks/:date` - Get/generate instances for date (e.g., `2026-02-07`)
- `POST /api/tasks/:id` - Toggle instance completion

**Non-standard**: This project uses `POST` for updates instead of `PUT/PATCH`. Follow this pattern for consistency.

## Frontend Structure

**Single-Page App** with view toggling in [src/App.js](src/App.js):
- `DailyChecklist` - View/complete tasks for a date with date navigation
- `DailyTaskManager` - CRUD operations on task templates
- `Congratulations` - Celebration modal when all tasks are completed

**Date Format**: Always use ISO format `YYYY-MM-DD` when working with dates. Example in [DailyChecklist.js](src/components/DailyChecklist.js#L9):
```javascript
const currentDate = new Date().toISOString().split('T')[0];
```

## Key Files

- [server.js](server.js) - Express app, routing, instance generation logic
- [db/init.js](db/init.js) - Database schema and initialization
- [src/components/DailyChecklist.js](src/components/DailyChecklist.js) - Task viewing/completion with date navigation
- [src/components/DailyTaskManager.js](src/components/DailyTaskManager.js) - Template CRUD interface

## Common Tasks

**Adding an API endpoint**: Add to [server.js](server.js), use the `getDatabase()` pattern, remember to close connections.

**Modifying the schema**: Update both CREATE TABLE statements in [db/init.js](db/init.js). Database file is `db/checklist.db`—delete it to reset.

**Adding a React component**: Place in `src/components/`, import CSS file with same name, follow existing patterns in [DailyChecklist.js](src/components/DailyChecklist.js) for state management and API calls.

**Testing instance generation**: Access `/api/tasks/YYYY-MM-DD` for any date—instances auto-generate on first request if templates exist.
