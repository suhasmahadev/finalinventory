import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ error, onClose }) => {
    if (!error) return null;

    const renderValidationErrors = () => {
        if (error.validationErrors && error.validationErrors.length > 0) {
            return (
                <div className="validation-errors">
                    <strong>Validation Errors:</strong>
                    <ul>
                        {error.validationErrors.map((err, index) => (
                            <li key={index}>
                                <strong>{err.field}:</strong> {err.message}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="error-message">
            <div className="error-content">
                <span className="error-icon">⚠️</span>
                <div className="error-text">
                    <strong>Error:</strong> {error.message || 'An error occurred'}
                    {renderValidationErrors()}
                </div>
            </div>
            {onClose && (
                <button className="error-close" onClick={onClose}>
                    ×
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
