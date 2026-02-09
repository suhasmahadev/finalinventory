import { useEffect, useState } from 'react';
import * as warehouseApi from '../api/warehouseApi';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Warehouses = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newWarehouse, setNewWarehouse] = useState({ name: '', address: '' });

    const fetchWarehouses = async () => {
        try {
            const data = await warehouseApi.getWarehouses();
            setWarehouses(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const handleCreate = async () => {
        await warehouseApi.createWarehouse(newWarehouse);
        setModalOpen(false);
        fetchWarehouses();
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'address', label: 'Address' },
        { key: 'id', label: 'ID' },
    ];

    return (
        <div className="flex-col gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold">Warehouses</h1>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    + Add Warehouse
                </button>
            </div>

            <DataTable
                columns={columns}
                data={warehouses}
            />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Warehouse">
                <div className="flex flex-col gap-4">
                    <input className="input" placeholder="Name" value={newWarehouse.name} onChange={e => setNewWarehouse({ ...newWarehouse, name: e.target.value })} />
                    <input className="input" placeholder="Address" value={newWarehouse.address} onChange={e => setNewWarehouse({ ...newWarehouse, address: e.target.value })} />
                    <div className="flex justify-end gap-2 mt-4">
                        <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleCreate}>Save</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Warehouses;
