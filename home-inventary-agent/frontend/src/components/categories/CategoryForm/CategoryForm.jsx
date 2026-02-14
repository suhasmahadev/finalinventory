import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriesApi } from '../../../services/api';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';
import SuccessMessage from '../../common/SuccessMessage/SuccessMessage';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';

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
        <div className="max-w-xl mx-auto">
            <div className="glass-panel p-8 rounded-xl shadow-lg border border-beige-200">
                <h2 className="text-2xl font-bold text-brown-900 mb-6 border-b border-beige-200 pb-4">
                    {isEditMode ? 'Edit Category' : 'Create New Category'}
                </h2>

                <ErrorMessage error={error} onClose={() => setError(null)} />
                <SuccessMessage message={success} onClose={() => setSuccess(null)} />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-brown-700 mb-1">
                            Category Name <span className="text-red-500">*</span>
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
                            className="w-full px-4 py-2 rounded-lg bg-white/50 border border-beige-300 focus:ring-2 focus:ring-brown-400 focus:border-brown-400 outline-none transition-all text-brown-800 placeholder-brown-400"
                        />
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-beige-200">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-2.5 bg-brown-600 hover:bg-brown-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2.5 bg-beige-200 hover:bg-beige-300 text-brown-800 font-semibold rounded-lg transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
