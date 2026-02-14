import React, { useState, useEffect } from 'react';
import { productsApi, categoriesApi } from '../../../services/api';
import ErrorMessage from '../../common/ErrorMessage';
import SuccessMessage from '../../common/SuccessMessage';
import LoadingSpinner from '../../common/LoadingSpinner';

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
        <div className="max-w-3xl mx-auto">
            <div className="glass-panel p-8 rounded-xl shadow-lg border border-beige-200">
                <h2 className="text-2xl font-bold text-brown-900 mb-6 border-b border-beige-200 pb-4">
                    {isEditMode ? 'Edit Product' : 'Create New Product'}
                </h2>

                <ErrorMessage error={error} onClose={() => setError(null)} />
                <SuccessMessage message={success} onClose={() => setSuccess(null)} />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-brown-700 mb-1">
                                Product Name <span className="text-red-500">*</span>
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
                                className="w-full px-4 py-2 rounded-lg bg-white/50 border border-beige-300 focus:ring-2 focus:ring-brown-400 focus:border-brown-400 outline-none transition-all text-brown-800 placeholder-brown-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="sku" className="block text-sm font-semibold text-brown-700 mb-1">
                                SKU
                            </label>
                            <input
                                type="text"
                                id="sku"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                maxLength={128}
                                placeholder="Stock Keeping Unit"
                                className="w-full px-4 py-2 rounded-lg bg-white/50 border border-beige-300 focus:ring-2 focus:ring-brown-400 focus:border-brown-400 outline-none transition-all text-brown-800 placeholder-brown-400"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-semibold text-brown-700 mb-1">
                                    Price <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-brown-400">$</span>
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
                                        className="w-full pl-8 pr-4 py-2 rounded-lg bg-white/50 border border-beige-300 focus:ring-2 focus:ring-brown-400 focus:border-brown-400 outline-none transition-all text-brown-800 placeholder-brown-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="category_id" className="block text-sm font-semibold text-brown-700 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg bg-white/50 border border-beige-300 focus:ring-2 focus:ring-brown-400 focus:border-brown-400 outline-none transition-all text-brown-800"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="unit" className="block text-sm font-semibold text-brown-700 mb-1">
                                    Unit
                                </label>
                                <input
                                    type="text"
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    maxLength={32}
                                    placeholder="e.g., kg, pcs, liters"
                                    className="w-full px-4 py-2 rounded-lg bg-white/50 border border-beige-300 focus:ring-2 focus:ring-brown-400 focus:border-brown-400 outline-none transition-all text-brown-800 placeholder-brown-400"
                                />
                            </div>

                            <div className="flex items-center pt-7">
                                <label className="flex items-center gap-2 cursor-pointer select-none text-brown-700 font-medium">
                                    <input
                                        type="checkbox"
                                        id="in_stock"
                                        name="in_stock"
                                        checked={formData.in_stock}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-brown-600 rounded border-beige-300 focus:ring-brown-500"
                                    />
                                    In Stock
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="reorder_threshold" className="block text-sm font-semibold text-brown-700 mb-1">
                                    Reorder Threshold
                                </label>
                                <input
                                    type="number"
                                    id="reorder_threshold"
                                    name="reorder_threshold"
                                    value={formData.reorder_threshold}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="Minimum stock level"
                                    className="w-full px-4 py-2 rounded-lg bg-white/50 border border-beige-300 focus:ring-2 focus:ring-brown-400 focus:border-brown-400 outline-none transition-all text-brown-800 placeholder-brown-400"
                                />
                            </div>

                            <div>
                                <label htmlFor="lead_time_days" className="block text-sm font-semibold text-brown-700 mb-1">
                                    Lead Time (Days)
                                </label>
                                <input
                                    type="number"
                                    id="lead_time_days"
                                    name="lead_time_days"
                                    value={formData.lead_time_days}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="Days to restock"
                                    className="w-full px-4 py-2 rounded-lg bg-white/50 border border-beige-300 focus:ring-2 focus:ring-brown-400 focus:border-brown-400 outline-none transition-all text-brown-800 placeholder-brown-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-beige-200">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-2.5 bg-brown-600 hover:bg-brown-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
                        </button>
                        {onCancel && (
                            <button
                                type="button"
                                className="px-6 py-2.5 bg-beige-200 hover:bg-beige-300 text-brown-800 font-semibold rounded-lg transition-colors disabled:opacity-50"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {!isEditMode && (
                    <div className="mt-6 p-4 bg-brown-50 rounded-lg border border-brown-100 text-sm text-brown-700 flex gap-3">
                        <div className="text-xl">💡</div>
                        <p>
                            <strong>Note:</strong> When you create a product, the ML model will
                            automatically predict sales based on the product details. The
                            prediction will be displayed in the product list.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductForm;
