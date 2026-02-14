import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../../../services/api';
import DataTable from '../../common/DataTable/DataTable';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage';


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
                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${value
                        ? 'bg-brown-100 text-brown-700 border-brown-200'
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                    {value ? 'Yes' : 'No'}
                </span>
            ),
        },
        {
            key: 'predicted_sales',
            label: 'Predicted Sales (ML)',
            render: (value) => (
                <span className="font-mono text-brown-600">
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
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brown-900 mb-2">Products</h1>
                    <p className="text-brown-500">Manage your inventory items and stock levels.</p>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded-lg shadow-lg shadow-brown-600/20 transition-all duration-200"
                    onClick={handleCreateNew}
                >
                    <span className="text-lg font-bold">+</span> Create New Product
                </button>
            </div>

            <ErrorMessage error={error} onClose={() => setError(null)} />

            <div className="glass-panel rounded-xl overflow-hidden backdrop-blur-sm">
                <DataTable data={products} columns={columns} onRowClick={handleRowClick} />

                {/* Pagination */}
                <div className="p-4 border-t border-beige-200 flex items-center justify-between bg-beige-50/50">
                    <button
                        className="px-4 py-2 rounded-lg border border-beige-300 text-brown-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={handlePreviousPage}
                        disabled={skip === 0}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-brown-500 font-medium">
                        Showing {skip + 1} - {skip + products.length}
                    </span>
                    <button
                        className="px-4 py-2 rounded-lg border border-beige-300 text-brown-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={handleNextPage}
                        disabled={products.length < limit}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
