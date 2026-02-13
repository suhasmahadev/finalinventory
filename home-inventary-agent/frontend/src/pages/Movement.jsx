import { useState, useEffect } from 'react';
import * as movementApi from '../api/movementApi';
import * as inventoryApi from '../api/inventoryApi';
import * as warehouseApi from '../api/warehouseApi';
import Modal from '../components/Modal';

const Movement = () => {
    const [items, setItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [adjustModalOpen, setAdjustModalOpen] = useState(false);
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [adjustForm, setAdjustForm] = useState({
        batch_id: '',
        adjustment_quantity: 0,
        reason: ''
    });
    const [transferForm, setTransferForm] = useState({
        batch_id: '',
        target_room_id: '',
        quantity: 0
    });

    useEffect(() => {
        fetchItems();
        fetchWarehouses();
    }, []);

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

    const handleAdjust = async () => {
        try {
            await movementApi.adjustStock(adjustForm);
            setAdjustModalOpen(false);
            setAdjustForm({ batch_id: '', adjustment_quantity: 0, reason: '' });
            alert('Stock adjusted successfully');
        } catch (err) {
            alert(err.message || 'Failed to adjust stock');
        }
    };

    const handleTransfer = async () => {
        try {
            await movementApi.transferStock(transferForm);
            setTransferModalOpen(false);
            setTransferForm({ batch_id: '', target_room_id: '', quantity: 0 });
            alert('Stock transferred successfully');
        } catch (err) {
            alert(err.message || 'Failed to transfer stock');
        }
    };

    return (
        <div className="flex-col gap-4">
            <h1 className="text-lg font-bold">Stock Movement</h1>

            <div className="flex gap-4">
                <button className="btn btn-primary" onClick={() => setAdjustModalOpen(true)}>
                    Manual Adjustment
                </button>
                <button className="btn btn-primary" onClick={() => setTransferModalOpen(true)}>
                    Transfer Stock
                </button>
            </div>

            <Modal isOpen={adjustModalOpen} onClose={() => setAdjustModalOpen(false)} title="Manual Stock Adjustment">
                <div className="flex flex-col gap-4">
                    <input
                        className="input"
                        placeholder="Batch ID"
                        value={adjustForm.batch_id}
                        onChange={(e) => setAdjustForm({ ...adjustForm, batch_id: e.target.value })}
                    />
                    <input
                        className="input"
                        type="number"
                        placeholder="Adjustment Quantity (+ or -)"
                        value={adjustForm.adjustment_quantity}
                        onChange={(e) => setAdjustForm({ ...adjustForm, adjustment_quantity: parseFloat(e.target.value) })}
                    />
                    <input
                        className="input"
                        placeholder="Reason"
                        value={adjustForm.reason}
                        onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <button className="btn btn-secondary" onClick={() => setAdjustModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleAdjust}>Adjust</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={transferModalOpen} onClose={() => setTransferModalOpen(false)} title="Transfer Stock">
                <div className="flex flex-col gap-4">
                    <input
                        className="input"
                        placeholder="Batch ID"
                        value={transferForm.batch_id}
                        onChange={(e) => setTransferForm({ ...transferForm, batch_id: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Target Room ID"
                        value={transferForm.target_room_id}
                        onChange={(e) => setTransferForm({ ...transferForm, target_room_id: e.target.value })}
                    />
                    <input
                        className="input"
                        type="number"
                        placeholder="Quantity"
                        value={transferForm.quantity}
                        onChange={(e) => setTransferForm({ ...transferForm, quantity: parseFloat(e.target.value) })}
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <button className="btn btn-secondary" onClick={() => setTransferModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleTransfer}>Transfer</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Movement;
