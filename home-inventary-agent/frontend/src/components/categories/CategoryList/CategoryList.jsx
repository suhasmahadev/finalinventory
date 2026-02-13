import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesApi } from '../../../services/api';
import DataTable from '../../common/DataTable/DataTable';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';
import './CategoryList.css';

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
        <div className="category-list-container">
            <div className="list-header">
                <h1>Categories</h1>
                <button className="btn btn-primary" onClick={() => navigate('/categories/create')}>
                    + Create New Category
                </button>
            </div>

            <ErrorMessage error={error} onClose={() => setError(null)} />

            <DataTable data={categories} columns={columns} onRowClick={handleRowClick} />
        </div>
    );
};

export default CategoryList;
