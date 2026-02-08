import React, { useState, useEffect } from 'react';
import './DailyTaskForm.css';

function DailyTaskForm({ initialTask, onSubmit, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialTask) {
            setTitle(initialTask.title);
            setDescription(initialTask.description || '');
        }
    }, [initialTask]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('Please enter a task title');
            return;
        }
        onSubmit({ title: title.trim(), description: description.trim() });
    };

    return (
        <div className="daily-task-form">
            <h3>{initialTask ? 'Edit Task Template' : 'New Task Template'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description (optional)</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                        rows="3"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        {initialTask ? 'Update' : 'Create'}
                    </button>
                    <button type="button" onClick={onCancel} className="cancel-btn">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DailyTaskForm;
