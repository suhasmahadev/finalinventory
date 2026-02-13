import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoriesApi } from '../../../services/api';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../common/SuccessMessage/SuccessMessage';
import './CategoryDetail.css';

const CategoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchCategory();
    }, [id]);

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const response = await categoriesApi.getCategory(id);
            setCategory(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await categoriesApi.deleteCategory(id);
            setSuccess('Category deleted successfully!');
            setTimeout(() => {
                navigate('/categories');
            }, 1500);
        } catch (err) {
            setError(err);
            setShowDeleteConfirm(false);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading category..." />;
    }

    if (!category) {
        return <div className="error-container">Category not found</div>;
    }

    return (
        <div className="category-detail-container">
            <div className="detail-header">
                <h1>Category Details</h1>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate('/categories')}>
                        ← Back to List
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate(`/categories/${id}/edit`)}>
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
                        Delete
                    </button>
                </div>
            </div>

            <ErrorMessage error={error} onClose={() => setError(null)} />
            <SuccessMessage message={success} onClose={() => setSuccess(null)} />

            <div className="detail-card">
                <div className="detail-row">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">{category.id}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{category.name}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Created At:</span>
                    <span className="detail-value">{new Date(category.created_at).toLocaleString()}</span>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this category? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryDetail;
