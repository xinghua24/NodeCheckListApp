import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import Congratulations from './Congratulations';
import './DailyChecklist.css';

function DailyChecklist() {
    const [tasks, setTasks] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [showCongrats, setShowCongrats] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, [currentDate]);

    useEffect(() => {
        // Check if all tasks are completed
        if (tasks.length > 0) {
            const allCompleted = tasks.every(task => task.completed);
            setShowCongrats(allCompleted);
        } else {
            setShowCongrats(false);
        }
    }, [tasks]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/tasks/${currentDate}`);
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                console.error('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (taskId, currentCompleted) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !currentCompleted })
            });

            if (response.ok) {
                const updatedTask = await response.json();
                setTasks(tasks.map(task =>
                    task.id === taskId ? updatedTask : task
                ));
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const changeDate = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate.toISOString().split('T')[0]);
    };

    const goToToday = () => {
        setCurrentDate(new Date().toISOString().split('T')[0]);
    };

    const isToday = currentDate === new Date().toISOString().split('T')[0];

    return (
        <div className="daily-checklist">
            <div className="date-navigation">
                <button onClick={() => changeDate(-1)} className="date-btn">← Previous</button>
                <div className="date-display">
                    <h2>{new Date(currentDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</h2>
                    {!isToday && (
                        <button onClick={goToToday} className="today-btn">Go to Today</button>
                    )}
                </div>
                <button onClick={() => changeDate(1)} className="date-btn">Next →</button>
            </div>

            {loading ? (
                <div className="loading">Loading tasks...</div>
            ) : (
                <>
                    {tasks.length === 0 ? (
                        <div className="no-tasks">
                            <p>No tasks for this date.</p>
                            <p>Create daily task templates in the "Manage Daily Tasks" section to get started!</p>
                        </div>
                    ) : (
                        <div className="tasks-container">
                            {tasks.map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={() => toggleTask(task.id, task.completed)}
                                />
                            ))}

                            <div className="task-summary">
                                <p>
                                    Completed: {tasks.filter(t => t.completed).length} / {tasks.length}
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}

            {showCongrats && <Congratulations />}
        </div>
    );
}

export default DailyChecklist;
