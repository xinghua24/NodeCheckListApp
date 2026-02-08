import React from 'react';
import './TaskItem.css';

function TaskItem({ task, onToggle }) {
    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                checked={task.completed}
                onChange={onToggle}
                id={`task-${task.id}`}
            />
            <label htmlFor={`task-${task.id}`} className="task-content">
                <div className="task-title">{task.title}</div>
                {task.description && (
                    <div className="task-description">{task.description}</div>
                )}
            </label>
        </div>
    );
}

export default TaskItem;
