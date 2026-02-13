import React, { useEffect } from 'react';
import './SuccessMessage.css';

const SuccessMessage = ({ message, onClose, autoClose = true, duration = 3000 }) => {
    useEffect(() => {
        if (autoClose && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    if (!message) return null;

    return (
        <div className="success-message">
            <div className="success-content">
                <span className="success-icon">✓</span>
                <div className="success-text">
                    <strong>Success!</strong> {message}
                </div>
            </div>
            {onClose && (
                <button className="success-close" onClick={onClose}>
                    ×
                </button>
            )}
        </div>
    );
};

export default SuccessMessage;
