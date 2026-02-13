import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ error, onClose }) => {
    if (!error) return null;

    // Handle validation errors (422)
    if (error.validationErrors) {
        return (
            <div className="error-message validation-error">
                <div className="error-header">
                    <h4>Validation Errors</h4>
                    {onClose && (
                        <button className="close-btn" onClick={onClose}>
                            ×
                        </button>
                    )}
                </div>
                <ul className="validation-list">
                    {error.validationErrors.map((err, index) => (
                        <li key={index}>
                            <strong>{err.field}:</strong> {err.message}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Handle general errors
    const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        'An unexpected error occurred';

    return (
        <div className="error-message general-error">
            <div className="error-header">
                <h4>Error</h4>
                {onClose && (
                    <button className="close-btn" onClick={onClose}>
                        ×
                    </button>
                )}
            </div>
            <p className="error-text">{errorMessage}</p>
        </div>
    );
};

export default ErrorMessage;
