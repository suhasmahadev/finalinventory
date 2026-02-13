import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../../../services/api';
import DataTable from '../../common/DataTable';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [skip, setSkip] = useState(0);
    const [limit] = useState(100);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productsApi.getAllProducts(skip, limit);
            setProducts(response.data);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [skip, limit]);

    const handleRowClick = (product) => {
        navigate(`/products/${product.id}`);
    };

    const handleCreateNew = () => {
        navigate('/products/create');
    };

    const handlePreviousPage = () => {
        setSkip((prev) => Math.max(0, prev - limit));
    };

    const handleNextPage = () => {
        setSkip((prev) => prev + limit);
    };

    const columns = [
        {
            key: 'id',
            label: 'ID',
        },
        {
            key: 'name',
            label: 'Product Name',
        },
        {
            key: 'sku',
            label: 'SKU',
            render: (value) => value || '-',
        },
        {
            key: 'price',
            label: 'Price',
            render: (value) => `$${parseFloat(value).toFixed(2)}`,
        },
        {
            key: 'category_name',
            label: 'Category',
            render: (value) => value || '-',
        },
        {
            key: 'in_stock',
            label: 'In Stock',
            render: (value) => (
                <span className={`badge ${value ? 'badge-success' : 'badge-danger'}`}>
                    {value ? 'Yes' : 'No'}
                </span>
            ),
        },
        {
            key: 'predicted_sales',
            label: 'Predicted Sales (ML)',
            render: (value) => (
                <span className="predicted-sales">
                    {value !== null && value !== undefined
                        ? parseFloat(value).toFixed(2)
                        : 'N/A'}
                </span>
            ),
        },
        {
            key: 'created_at',
            label: 'Created At',
            render: (value) => new Date(value).toLocaleDateString(),
        },
    ];

    if (loading) {
        return <LoadingSpinner message="Loading products..." />;
    }

    return (
        <div className="product-list-container">
            <div className="list-header">
                <h1>Products</h1>
                <button className="btn btn-primary" onClick={handleCreateNew}>
                    + Create New Product
                </button>
            </div>

            <ErrorMessage error={error} onClose={() => setError(null)} />

            <DataTable data={products} columns={columns} onRowClick={handleRowClick} />

            <div className="pagination">
                <button
                    className="btn btn-secondary"
                    onClick={handlePreviousPage}
                    disabled={skip === 0}
                >
                    Previous
                </button>
                <span className="pagination-info">
                    Showing {skip + 1} - {skip + products.length}
                </span>
                <button
                    className="btn btn-secondary"
                    onClick={handleNextPage}
                    disabled={products.length < limit}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductList;
