import React, { useEffect, useState } from 'react';
import './Congratulations.css';

function Congratulations() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        setTimeout(() => setShow(true), 100);
    }, []);

    return (
        <div className={`congratulations-overlay ${show ? 'show' : ''}`}>
            <div className="congratulations-card">
                <div className="congrats-emoji">🎉</div>
                <h2>Congratulations!</h2>
                <p>You've completed all your tasks for today!</p>
                <div className="confetti">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="confetti-piece" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            backgroundColor: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'][Math.floor(Math.random() * 5)]
                        }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Congratulations;
