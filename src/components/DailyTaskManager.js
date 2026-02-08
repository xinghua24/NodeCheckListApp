import React, { useState, useEffect } from 'react';
import DailyTaskForm from './DailyTaskForm';
import './DailyTaskManager.css';

function DailyTaskManager() {
    const [dailyTasks, setDailyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchDailyTasks();
    }, []);

    const fetchDailyTasks = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/daily-tasks');
            if (response.ok) {
                const data = await response.json();
                setDailyTasks(data);
            }
        } catch (error) {
            console.error('Error fetching daily tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = () => {
        setEditingTask(null);
        setShowForm(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this daily task? This will not affect already generated task instances.')) {
            return;
        }

        try {
            const response = await fetch(`/api/daily-tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setDailyTasks(dailyTasks.filter(task => task.id !== taskId));
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleFormSubmit = async (taskData) => {
        try {
            if (editingTask) {
                // Update existing task
                const response = await fetch(`/api/daily-tasks/${editingTask.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });

                if (response.ok) {
                    const updatedTask = await response.json();
                    setDailyTasks(dailyTasks.map(task =>
                        task.id === editingTask.id ? updatedTask : task
                    ));
                    setShowForm(false);
                    setEditingTask(null);
                }
            } else {
                // Create new task
                const response = await fetch('/api/daily-tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });

                if (response.ok) {
                    const newTask = await response.json();
                    setDailyTasks([...dailyTasks, newTask]);
                    setShowForm(false);
                }
            }
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    return (
        <div className="daily-task-manager">
            <div className="manager-header">
                <h2>Daily Task Templates</h2>
                <button onClick={handleAddTask} className="add-task-btn">
                    + Add Daily Task
                </button>
            </div>

            <p className="manager-description">
                Create task templates that will automatically appear in your daily checklist each day.
                Changes to templates won't affect already generated daily tasks.
            </p>

            {showForm && (
                <DailyTaskForm
                    initialTask={editingTask}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                />
            )}

            {loading ? (
                <div className="loading">Loading daily tasks...</div>
            ) : (
                <div className="daily-tasks-list">
                    {dailyTasks.length === 0 ? (
                        <div className="no-tasks">
                            <p>No daily task templates yet.</p>
                            <p>Click "Add Daily Task" to create your first template!</p>
                        </div>
                    ) : (
                        dailyTasks.map(task => (
                            <div key={task.id} className="daily-task-card">
                                <div className="task-card-content">
                                    <h3>{task.title}</h3>
                                    {task.description && <p>{task.description}</p>}
                                </div>
                                <div className="task-card-actions">
                                    <button onClick={() => handleEditTask(task)} className="edit-btn">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default DailyTaskManager;
