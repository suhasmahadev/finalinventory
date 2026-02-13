import React, { useState, useEffect } from 'react';
import { productsApi, categoriesApi } from '../../../services/api';
import ErrorMessage from '../../common/ErrorMessage';
import SuccessMessage from '../../common/SuccessMessage';
import LoadingSpinner from '../../common/LoadingSpinner';
import './ProductForm.css';

const ProductForm = ({ productId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        in_stock: true,
        category_id: '',
        unit: '',
        reorder_threshold: '',
        lead_time_days: '',
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const isEditMode = !!productId;

    // Load categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await categoriesApi.getAllCategories();
                setCategories(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Load product data if editing
    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const response = await productsApi.getProduct(productId);
                    const product = response.data;

                    setFormData({
                        name: product.name || '',
                        sku: product.sku || '',
                        price: product.price || '',
                        in_stock: product.in_stock,
                        category_id: product.category_id || '',
                        unit: product.unit || '',
                        reorder_threshold: product.reorder_threshold || '',
                        lead_time_days: product.lead_time_days || '',
                    });
                } catch (err) {
                    setError(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchProduct();
        }
    }, [productId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            // Prepare data - convert empty strings to null for optional fields
            const submitData = {
                name: formData.name,
                sku: formData.sku || null,
                price: parseFloat(formData.price),
                in_stock: formData.in_stock,
                category_id: parseInt(formData.category_id),
                unit: formData.unit || null,
                reorder_threshold: formData.reorder_threshold ? parseFloat(formData.reorder_threshold) : null,
                lead_time_days: formData.lead_time_days ? parseInt(formData.lead_time_days) : null,
            };

            let response;
            if (isEditMode) {
                // For update, only send fields that are not null
                const updateData = {};
                Object.keys(submitData).forEach(key => {
                    if (submitData[key] !== null && submitData[key] !== '') {
                        updateData[key] = submitData[key];
                    }
                });
                response = await productsApi.updateProduct(productId, updateData);
                setSuccess('Product updated successfully!');
            } else {
                response = await productsApi.createProduct(submitData);
                setSuccess('Product created successfully with ML prediction!');
            }

            // Reset form if creating
            if (!isEditMode) {
                setFormData({
                    name: '',
                    sku: '',
                    price: '',
                    in_stock: true,
                    category_id: '',
                    unit: '',
                    reorder_threshold: '',
                    lead_time_days: '',
                });
            }

            // Call success callback
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    if (loadingCategories) {
        return <LoadingSpinner message="Loading categories..." />;
    }

    return (
        <div className="product-form-container">
            <h2>{isEditMode ? 'Edit Product' : 'Create New Product'}</h2>

            <ErrorMessage error={error} onClose={() => setError(null)} />
            <SuccessMessage message={success} onClose={() => setSuccess(null)} />

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="name">
                        Product Name <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength={512}
                        placeholder="Enter product name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="sku">SKU</label>
                    <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        maxLength={128}
                        placeholder="Stock Keeping Unit"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price">
                            Price <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category_id">
                            Category <span className="required">*</span>
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="unit">Unit</label>
                        <input
                            type="text"
                            id="unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            maxLength={32}
                            placeholder="e.g., kg, pcs, liters"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label htmlFor="in_stock">
                            <input
                                type="checkbox"
                                id="in_stock"
                                name="in_stock"
                                checked={formData.in_stock}
                                onChange={handleChange}
                            />
                            In Stock
                        </label>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="reorder_threshold">Reorder Threshold</label>
                        <input
                            type="number"
                            id="reorder_threshold"
                            name="reorder_threshold"
                            value={formData.reorder_threshold}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="Minimum stock level"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lead_time_days">Lead Time (Days)</label>
                        <input
                            type="number"
                            id="lead_time_days"
                            name="lead_time_days"
                            value={formData.lead_time_days}
                            onChange={handleChange}
                            min="0"
                            placeholder="Days to restock"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {!isEditMode && (
                <div className="info-box">
                    <p>
                        <strong>Note:</strong> When you create a product, the ML model will
                        automatically predict sales based on the product details. The
                        prediction will be displayed in the product list.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductForm;
