import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesApi } from '../../../services/api';
import DataTable from '../../common/DataTable/DataTable';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';


const CategoryList = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await categoriesApi.getAllCategories();
            setCategories(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (category) => {
        navigate(`/categories/${category.id}`);
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Category Name' },
        {
            key: 'created_at',
            label: 'Created At',
            render: (value) => new Date(value).toLocaleDateString(),
        },
    ];

    if (loading) {
        return <LoadingSpinner message="Loading categories..." />;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brown-900 mb-2">Categories</h1>
                    <p className="text-brown-500">Manage your product categories and organization.</p>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded-lg shadow-lg shadow-brown-600/20 transition-all duration-200"
                    onClick={() => navigate('/categories/create')}
                >
                    <span className="text-lg font-bold">+</span> Create New Category
                </button>
            </div>

            <ErrorMessage error={error} onClose={() => setError(null)} />

            <div className="glass-panel rounded-xl overflow-hidden backdrop-blur-sm">
                <DataTable data={categories} columns={columns} onRowClick={handleRowClick} />
            </div>
        </div>
    );
};

export default CategoryList;
