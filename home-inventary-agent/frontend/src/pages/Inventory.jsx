import { useEffect, useState } from 'react';
import * as inventoryApi from '../api/inventoryApi';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', sku: '', unit: 'pcs', reorder_threshold: 10 });
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

    useEffect(() => {
        fetchItems();
    }, []);

    const handleCreate = async () => {
        try {
            await inventoryApi.createItem(newItem);
            setIsCreateModalOpen(false);
            setNewItem({ name: '', sku: '', unit: 'pcs', reorder_threshold: 10 });
            fetchItems();
        } catch (err) {
            alert(err.message || "Failed to create item");
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'total_stock', label: 'Total Stock' },
        { key: 'unit', label: 'Unit' },
        { 
            key: 'reorder_threshold', 
            label: 'Reorder Level',
            render: (val) => val ?? 'N/A'
        },
    ];

    return (
        <div className="flex-col gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold">Inventory</h1>
                <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                    + Add Item
                </button>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: 'var(--danger-color)', borderRadius: '4px' }}>
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
                title="Create New Item"
            >
                <div className="flex flex-col gap-4">
                    <input
                        className="input"
                        placeholder="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="SKU"
                        value={newItem.sku}
                        onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    />
                    <div className="flex gap-2">
                        <input
                            className="input"
                            placeholder="Unit (e.g. kg, pcs)"
                            value={newItem.unit}
                            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                        />
                        <input
                            className="input"
                            type="number"
                            placeholder="Reorder Level"
                            value={newItem.reorder_threshold}
                            onChange={(e) => setNewItem({ ...newItem, reorder_threshold: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleCreate}>Create Item</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Inventory;
