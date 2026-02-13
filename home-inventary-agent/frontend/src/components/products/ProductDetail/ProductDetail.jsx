import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../../../services/api';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';
import SuccessMessage from '../../common/SuccessMessage';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productsApi.getProduct(id);
                setProduct(response.data);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleEdit = () => {
        navigate(`/products/${id}/edit`);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            setDeleting(true);
            await productsApi.deleteProduct(id);
            setSuccess('Product deleted successfully!');
            setTimeout(() => {
                navigate('/products');
            }, 1500);
        } catch (err) {
            setError(err);
            setDeleting(false);
        }
    };

    const handleBack = () => {
        navigate('/products');
    };

    if (loading) {
        return <LoadingSpinner message="Loading product details..." />;
    }

    if (!product) {
        return (
            <div className="product-detail-container">
                <ErrorMessage error={{ message: 'Product not found' }} />
                <button className="btn btn-secondary" onClick={handleBack}>
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            <div className="detail-header">
                <h1>Product Details</h1>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={handleBack}>
                        ← Back
                    </button>
                    <button className="btn btn-primary" onClick={handleEdit}>
                        Edit
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>

            <ErrorMessage error={error} onClose={() => setError(null)} />
            <SuccessMessage message={success} onClose={() => setSuccess(null)} />

            <div className="detail-card">
                <div className="detail-section">
                    <h2>Basic Information</h2>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <label>ID:</label>
                            <span>{product.id}</span>
                        </div>
                        <div className="detail-item">
                            <label>Name:</label>
                            <span>{product.name}</span>
                        </div>
                        <div className="detail-item">
                            <label>SKU:</label>
                            <span>{product.sku || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Price:</label>
                            <span className="price">${parseFloat(product.price).toFixed(2)}</span>
                        </div>
                        <div className="detail-item">
                            <label>Category:</label>
                            <span>{product.category_name || `ID: ${product.category_id}`}</span>
                        </div>
                        <div className="detail-item">
                            <label>Unit:</label>
                            <span>{product.unit || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>In Stock:</label>
                            <span className={`badge ${product.in_stock ? 'badge-success' : 'badge-danger'}`}>
                                {product.in_stock ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h2>Inventory Settings</h2>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <label>Reorder Threshold:</label>
                            <span>{product.reorder_threshold || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Lead Time (Days):</label>
                            <span>{product.lead_time_days || '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-section ml-section">
                    <h2>ML Prediction</h2>
                    <div className="ml-prediction-box">
                        <div className="prediction-label">Predicted Sales:</div>
                        <div className="prediction-value">
                            {product.predicted_sales !== null && product.predicted_sales !== undefined
                                ? parseFloat(product.predicted_sales).toFixed(2)
                                : 'Not Available'}
                        </div>
                        <p className="prediction-note">
                            This value is automatically calculated by the ML model based on product
                            attributes.
                        </p>
                    </div>
                </div>

                <div className="detail-section">
                    <h2>Metadata</h2>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <label>Created At:</label>
                            <span>{new Date(product.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
