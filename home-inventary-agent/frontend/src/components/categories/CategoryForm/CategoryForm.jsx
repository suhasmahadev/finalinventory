import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriesApi } from '../../../services/api';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../common/SuccessMessage/SuccessMessage';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './CategoryForm.css';

const CategoryForm = ({ onSuccess, onCancel }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        setFetchLoading(true);
        try {
            const response = await categoriesApi.getCategory(id);
            setFormData({
                name: response.data.name || '',
            });
        } catch (err) {
            setError(err);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                await categoriesApi.updateCategory(id, formData);
                setSuccess('Category updated successfully!');
            } else {
                await categoriesApi.createCategory(formData);
                setSuccess('Category created successfully!');
            }

            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate('/categories');
                }
            }, 1500);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate('/categories');
        }
    };

    if (fetchLoading) {
        return <LoadingSpinner message="Loading category..." />;
    }

    return (
        <div className="category-form-container">
            <h2>{isEditMode ? 'Edit Category' : 'Create New Category'}</h2>

            <ErrorMessage error={error} onClose={() => setError(null)} />
            <SuccessMessage message={success} onClose={() => setSuccess(null)} />

            <form onSubmit={handleSubmit} className="category-form">
                <div className="form-group">
                    <label htmlFor="name">
                        Category Name <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        maxLength={255}
                        placeholder="Enter category name"
                        disabled={loading}
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;
