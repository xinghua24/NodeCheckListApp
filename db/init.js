const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure db directory exists
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(__dirname, 'checklist.db');

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                reject(err);
                return;
            }
            console.log('Connected to SQLite database');
        });

        db.serialize(() => {
            // Create daily_tasks table (templates)
            db.run(`
        CREATE TABLE IF NOT EXISTS daily_tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
                if (err) {
                    console.error('Error creating daily_tasks table:', err);
                    reject(err);
                } else {
                    console.log('daily_tasks table ready');
                }
            });

            // Create task_instances table (daily generated tasks)
            db.run(`
        CREATE TABLE IF NOT EXISTS task_instances (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          daily_task_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          completed INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (daily_task_id) REFERENCES daily_tasks(id) ON DELETE CASCADE,
          UNIQUE(daily_task_id, date)
        )
      `, (err) => {
                if (err) {
                    console.error('Error creating task_instances table:', err);
                    reject(err);
                } else {
                    console.log('task_instances table ready');
                }
            });

            // Create index for faster date queries
            db.run(`
        CREATE INDEX IF NOT EXISTS idx_task_instances_date 
        ON task_instances(date)
      `, (err) => {
                if (err) {
                    console.error('Error creating index:', err);
                } else {
                    console.log('Database indexes ready');
                }
            });
        });

        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
                reject(err);
            } else {
                console.log('Database initialization complete');
                resolve();
            }
        });
    });
}

function getDatabase() {
    return new sqlite3.Database(dbPath);
}

module.exports = { initializeDatabase, getDatabase, dbPath };
