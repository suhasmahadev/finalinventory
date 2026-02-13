import { useEffect, useState } from 'react';
import * as inventoryApi from '../api/inventoryApi';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        sku: '',
        price: 0,
        in_stock: true,
        category_id: '',
        unit: 'pcs',
        reorder_threshold: 10,
        lead_time_days: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await inventoryApi.getItems();
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch inventory", error);
            setError(error.message || "Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await inventoryApi.getCategories();
            setCategories(data);
            // Set default category if available
            if (data.length > 0 && !newItem.category_id) {
                setNewItem(prev => ({ ...prev, category_id: data[0].id }));
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const handleCreate = async () => {
        try {
            // Validate required fields
            if (!newItem.name) {
                alert("Product name is required");
                return;
            }
            if (!newItem.category_id) {
                alert("Category is required");
                return;
            }
            if (newItem.price < 0) {
                alert("Price must be non-negative");
                return;
            }

            await inventoryApi.createItem(newItem);
            setIsCreateModalOpen(false);
            setNewItem({
                name: '',
                sku: '',
                price: 0,
                in_stock: true,
                category_id: categories.length > 0 ? categories[0].id : '',
                unit: 'pcs',
                reorder_threshold: 10,
                lead_time_days: null
            });
            fetchItems();
        } catch (err) {
            alert(err.response?.data?.detail || err.message || "Failed to create item");
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'sku', label: 'SKU', render: (val) => val || 'N/A' },
        { key: 'category_name', label: 'Category', render: (val) => val || 'N/A' },
        { key: 'price', label: 'Price', render: (val) => `$${val?.toFixed(2) || '0.00'}` },
        { key: 'in_stock', label: 'In Stock', render: (val) => val ? '✅ Yes' : '❌ No' },
        {
            key: 'predicted_sales',
            label: 'Predicted Sales',
            render: (val) => val ? `${val.toFixed(2)} units` : 'N/A'
        },
        { key: 'unit', label: 'Unit', render: (val) => val || 'N/A' },
        {
            key: 'reorder_threshold',
            label: 'Reorder Level',
            render: (val) => val ?? 'N/A'
        },
    ];

    return (
        <div className="flex-col gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold">Inventory (ML-Powered)</h1>
                <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                    + Add Product
                </button>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: 'var(--danger-color)', borderRadius: '4px', color: 'white' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading inventory...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={items}
                    actions={(row) => (
                        <button className="btn btn-secondary text-sm">View Details</button>
                    )}
                />
            )}

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Product (with ML Prediction)"
            >
                <div className="flex flex-col gap-4">
                    <input
                        className="input"
                        placeholder="Product Name *"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        required
                    />

                    <input
                        className="input"
                        placeholder="SKU (optional)"
                        value={newItem.sku}
                        onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    />

                    <select
                        className="input"
                        value={newItem.category_id}
                        onChange={(e) => setNewItem({ ...newItem, category_id: parseInt(e.target.value) })}
                        required
                        style={{ padding: '0.5rem' }}
                    >
                        <option value="">Select Category *</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                        <input
                            className="input"
                            type="number"
                            step="0.01"
                            placeholder="Price *"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                            required
                            style={{ flex: 1 }}
                        />
                        <input
                            className="input"
                            placeholder="Unit (e.g. kg, pcs)"
                            value={newItem.unit}
                            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                            style={{ flex: 1 }}
                        />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem', background: '#f5f5f5', borderRadius: '4px' }}>
                        <input
                            type="checkbox"
                            checked={newItem.in_stock}
                            onChange={(e) => setNewItem({ ...newItem, in_stock: e.target.checked })}
                        />
                        <span>Product is in stock</span>
                    </label>

                    <div className="flex gap-2">
                        <input
                            className="input"
                            type="number"
                            placeholder="Reorder Level (optional)"
                            value={newItem.reorder_threshold}
                            onChange={(e) => setNewItem({ ...newItem, reorder_threshold: parseFloat(e.target.value) || null })}
                            style={{ flex: 1 }}
                        />
                        <input
                            className="input"
                            type="number"
                            placeholder="Lead Time (days)"
                            value={newItem.lead_time_days || ''}
                            onChange={(e) => setNewItem({ ...newItem, lead_time_days: parseInt(e.target.value) || null })}
                            style={{ flex: 1 }}
                        />
                    </div>

                    <div style={{ padding: '0.75rem', background: '#e3f2fd', borderRadius: '4px', fontSize: '0.875rem' }}>
                        <strong>ℹ️ ML Prediction:</strong> Sales will be automatically predicted based on price, category, and stock status.
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleCreate}>
                            Create Product
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Inventory;
