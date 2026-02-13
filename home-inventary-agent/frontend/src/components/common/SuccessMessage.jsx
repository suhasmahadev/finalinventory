import React from 'react';
import './SuccessMessage.css';

const SuccessMessage = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="success-message">
            <div className="success-header">
                <h4>Success</h4>
                {onClose && (
                    <button className="close-btn" onClick={onClose}>
                        ×
                    </button>
                )}
            </div>
            <p className="success-text">{message}</p>
        </div>
    );
};

export default SuccessMessage;
