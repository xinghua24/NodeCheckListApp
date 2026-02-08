import React, { useState } from 'react';
import DailyChecklist from './components/DailyChecklist';
import DailyTaskManager from './components/DailyTaskManager';
import './App.css';

function App() {
    const [currentView, setCurrentView] = useState('checklist'); // 'checklist' or 'manager'

    return (
        <div className="App">
            <header className="App-header">
                <h1>📋 Daily Checklist</h1>
                <nav className="App-nav">
                    <button
                        className={currentView === 'checklist' ? 'active' : ''}
                        onClick={() => setCurrentView('checklist')}
                    >
                        Today's Tasks
                    </button>
                    <button
                        className={currentView === 'manager' ? 'active' : ''}
                        onClick={() => setCurrentView('manager')}
                    >
                        Manage Daily Tasks
                    </button>
                </nav>
            </header>

            <main className="App-main">
                {currentView === 'checklist' ? (
                    <DailyChecklist />
                ) : (
                    <DailyTaskManager />
                )}
            </main>
        </div>
    );
}

export default App;
