import React, { useState, useEffect } from 'react';
import { productsApi } from '../../../services/api';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';
import './MLStatus.css';

const MLStatus = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setLoading(true);
                const response = await productsApi.getMLStatus();
                setStatus(response.data);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Checking ML model status..." />;
    }

    return (
        <div className="ml-status-container">
            <h1>ML Model Status</h1>

            <ErrorMessage error={error} onClose={() => setError(null)} />

            {status && (
                <div className="status-card">
                    <div className="status-header">
                        <h2>Model Status</h2>
                        <span className={`status-badge ${status.status === 'ready' ? 'status-ready' : 'status-not-ready'}`}>
                            {status.status === 'ready' ? '✓ Ready' : '✗ Not Loaded'}
                        </span>
                    </div>

                    {status.model_info && (
                        <div className="model-info">
                            <h3>Model Information</h3>
                            <div className="info-grid">
                                {Object.entries(status.model_info).map(([key, value]) => (
                                    <div key={key} className="info-item">
                                        <label>{key.replace(/_/g, ' ').toUpperCase()}:</label>
                                        <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="status-description">
                        <h3>About ML Predictions</h3>
                        <p>
                            The ML model automatically predicts sales for products when they are created or updated.
                            This helps in inventory planning and demand forecasting.
                        </p>
                        <ul>
                            <li>Predictions are generated automatically on product creation</li>
                            <li>Predictions are updated when product details change</li>
                            <li>No manual intervention required</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MLStatus;
