require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase, getDatabase } = require('./db/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Initialize database
initializeDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

// Helper function to generate task instances for a date
function generateTaskInstancesForDate(date) {
    return new Promise((resolve, reject) => {
        const db = getDatabase();

        // Get all daily tasks
        db.all('SELECT * FROM daily_tasks', [], (err, dailyTasks) => {
            if (err) {
                db.close();
                reject(err);
                return;
            }

            if (dailyTasks.length === 0) {
                db.close();
                resolve([]);
                return;
            }

            // Check if instances already exist for this date
            db.get('SELECT COUNT(*) as count FROM task_instances WHERE date = ?', [date], (err, result) => {
                if (err) {
                    db.close();
                    reject(err);
                    return;
                }

                if (result.count > 0) {
                    // Instances already exist, just fetch and return them
                    db.all(
                        `SELECT ti.*, dt.title, dt.description 
             FROM task_instances ti 
             JOIN daily_tasks dt ON ti.daily_task_id = dt.id 
             WHERE ti.date = ?
             ORDER BY ti.id`,
                        [date],
                        (err, instances) => {
                            db.close();
                            if (err) reject(err);
                            else resolve(instances);
                        }
                    );
                    return;
                }

                // Create new instances for this date
                const stmt = db.prepare('INSERT INTO task_instances (daily_task_id, date) VALUES (?, ?)');
                let completed = 0;
                let hasError = false;

                dailyTasks.forEach(task => {
                    stmt.run(task.id, date, (err) => {
                        if (err && !hasError) {
                            hasError = true;
                            stmt.finalize();
                            db.close();
                            reject(err);
                        } else {
                            completed++;
                            if (completed === dailyTasks.length) {
                                stmt.finalize();
                                // Fetch the newly created instances
                                db.all(
                                    `SELECT ti.*, dt.title, dt.description 
                   FROM task_instances ti 
                   JOIN daily_tasks dt ON ti.daily_task_id = dt.id 
                   WHERE ti.date = ?
                   ORDER BY ti.id`,
                                    [date],
                                    (err, instances) => {
                                        db.close();
                                        if (err) reject(err);
                                        else resolve(instances);
                                    }
                                );
                            }
                        }
                    });
                });

                // Handle case where there are no daily tasks
                if (dailyTasks.length === 0) {
                    stmt.finalize();
                    db.close();
                    resolve([]);
                }
            });
        });
    });
}

// ============ DAILY TASK TEMPLATE ENDPOINTS ============

// GET all daily task templates
app.get('/api/daily-tasks', (req, res) => {
    const db = getDatabase();

    db.all('SELECT * FROM daily_tasks ORDER BY id', [], (err, rows) => {
        db.close();
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST create a new daily task template
app.post('/api/daily-tasks', (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }

    const db = getDatabase();

    db.run(
        'INSERT INTO daily_tasks (title, description) VALUES (?, ?)',
        [title, description || ''],
        function (err) {
            if (err) {
                db.close();
                res.status(500).json({ error: err.message });
                return;
            }

            db.get('SELECT * FROM daily_tasks WHERE id = ?', [this.lastID], (err, row) => {
                db.close();
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(201).json(row);
            });
        }
    );
});

// POST update a daily task template
app.post('/api/daily-tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
    }

    const db = getDatabase();

    db.run(
        'UPDATE daily_tasks SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, description || '', id],
        function (err) {
            if (err) {
                db.close();
                res.status(500).json({ error: err.message });
                return;
            }

            if (this.changes === 0) {
                db.close();
                res.status(404).json({ error: 'Daily task not found' });
                return;
            }

            db.get('SELECT * FROM daily_tasks WHERE id = ?', [id], (err, row) => {
                db.close();
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(row);
            });
        }
    );
});

// DELETE a daily task template
app.delete('/api/daily-tasks/:id', (req, res) => {
    const { id } = req.params;
    const db = getDatabase();

    db.run('DELETE FROM daily_tasks WHERE id = ?', [id], function (err) {
        db.close();
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (this.changes === 0) {
            res.status(404).json({ error: 'Daily task not found' });
            return;
        }

        res.json({ message: 'Daily task deleted', id: id });
    });
});

// ============ TASK INSTANCE ENDPOINTS ============

// GET task instances for a specific date
app.get('/api/tasks/:date', async (req, res) => {
    const { date } = req.params;

    try {
        const instances = await generateTaskInstancesForDate(date);
        res.json(instances);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST mark a task instance as completed/uncompleted
app.post('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    const db = getDatabase();

    db.run(
        'UPDATE task_instances SET completed = ? WHERE id = ?',
        [completed ? 1 : 0, id],
        function (err) {
            if (err) {
                db.close();
                res.status(500).json({ error: err.message });
                return;
            }

            if (this.changes === 0) {
                db.close();
                res.status(404).json({ error: 'Task instance not found' });
                return;
            }

            db.get(
                `SELECT ti.*, dt.title, dt.description 
         FROM task_instances ti 
         JOIN daily_tasks dt ON ti.daily_task_id = dt.id 
         WHERE ti.id = ?`,
                [id],
                (err, row) => {
                    db.close();
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json(row);
                }
            );
        }
    );
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
