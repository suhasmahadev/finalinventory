import { useEffect, useState } from 'react';
import * as billingApi from '../api/billingApi';
import * as inventoryApi from '../api/inventoryApi';
import * as warehouseApi from '../api/warehouseApi';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [items, setItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [billForm, setBillForm] = useState({
        billing_type: 'PURCHASE',
        warehouse_id: '',
        items: []
    });
    const [lineItem, setLineItem] = useState({
        item_id: '',
        quantity: 0,
        unit_price: 0
    });

    useEffect(() => {
        fetchBills();
        fetchItems();
        fetchWarehouses();
    }, []);

    const fetchBills = async () => {
        try {
            setLoading(true);
            const data = await billingApi.listBills();
            setBills(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchItems = async () => {
        try {
            const data = await inventoryApi.getItems();
            setItems(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const data = await warehouseApi.getWarehouses();
            setWarehouses(data);
        } catch (e) {
            console.error(e);
        }
    };

    const addLineItem = () => {
        if (!lineItem.item_id || lineItem.quantity <= 0 || lineItem.unit_price <= 0) {
            alert('Please fill all line item fields');
            return;
        }
        setBillForm({
            ...billForm,
            items: [...billForm.items, lineItem]
        });
        setLineItem({ item_id: '', quantity: 0, unit_price: 0 });
    };

    const handleCreateBill = async () => {
        try {
            if (!billForm.warehouse_id || billForm.items.length === 0) {
                alert('Please select warehouse and add items');
                return;
            }
            await billingApi.createBill(billForm);
            setModalOpen(false);
            setBillForm({ billing_type: 'PURCHASE', warehouse_id: '', items: [] });
            fetchBills();
        } catch (err) {
            alert(err.message || 'Failed to create bill');
        }
    };

    const handlePostBill = async (billId) => {
        try {
            await billingApi.postBill(billId);
            fetchBills();
        } catch (err) {
            alert(err.message || 'Failed to post bill');
        }
    };

    const columns = [
        { key: 'bill_number', label: 'Bill Number' },
        { key: 'billing_type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'total_amount', label: 'Total Amount' }
    ];

    return (
        <div className="flex-col gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold">Billing</h1>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    + Create Bill
                </button>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: 'var(--danger-color)', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading bills...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={bills}
                    actions={(row) => (
                        row.status === 'DRAFT' && (
                            <button className="btn btn-secondary text-sm" onClick={() => handlePostBill(row.id)}>
                                Post Bill
                            </button>
                        )
                    )}
                />
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Bill">
                <div className="flex flex-col gap-4">
                    <select
                        className="input"
                        value={billForm.billing_type}
                        onChange={(e) => setBillForm({ ...billForm, billing_type: e.target.value })}
                    >
                        <option value="PURCHASE">Purchase</option>
                        <option value="SALE">Sale</option>
                    </select>

                    <select
                        className="input"
                        value={billForm.warehouse_id}
                        onChange={(e) => setBillForm({ ...billForm, warehouse_id: e.target.value })}
                    >
                        <option value="">Select Warehouse</option>
                        {warehouses.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>

                    <div className="card" style={{ padding: '1rem' }}>
                        <h4 className="font-bold mb-2">Add Line Items</h4>
                        <div className="flex gap-2">
                            <select
                                className="input"
                                value={lineItem.item_id}
                                onChange={(e) => setLineItem({ ...lineItem, item_id: e.target.value })}
                            >
                                <option value="">Select Item</option>
                                {items.map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                            <input
                                className="input"
                                type="number"
                                placeholder="Quantity"
                                value={lineItem.quantity}
                                onChange={(e) => setLineItem({ ...lineItem, quantity: parseFloat(e.target.value) })}
                            />
                            <input
                                className="input"
                                type="number"
                                placeholder="Unit Price"
                                value={lineItem.unit_price}
                                onChange={(e) => setLineItem({ ...lineItem, unit_price: parseFloat(e.target.value) })}
                            />
                            <button className="btn btn-secondary" onClick={addLineItem}>Add</button>
                        </div>
                        <div className="mt-2">
                            {billForm.items.map((item, idx) => (
                                <div key={idx} className="text-sm">
                                    Item: {item.item_id}, Qty: {item.quantity}, Price: {item.unit_price}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleCreateBill}>Create Bill</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Billing;
