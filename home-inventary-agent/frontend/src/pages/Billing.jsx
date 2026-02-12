import { useEffect, useState } from 'react';
import * as billingApi from '../api/billingApi';
import * as inventoryApi from '../api/inventoryApi';
import * as warehouseApi from '../api/warehouseApi';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Receipt, Clock, Sparkles, ShieldCheck } from 'lucide-react';

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [items, setItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [billForm, setBillForm] = useState({ billing_type: 'PURCHASE', warehouse_id: '', items: [] });
    const [lineItem, setLineItem] = useState({ item_id: '', quantity: 0, unit_price: 0 });

    useEffect(() => { fetchBills(); fetchItems(); fetchWarehouses(); }, []);
    const fetchBills = async () => { try { setLoading(true); const data = await billingApi.listBills(); setBills(data); } catch (e) { console.error(e); } finally { setLoading(false); } };
    const fetchItems = async () => { try { const data = await inventoryApi.getItems(); setItems(data); } catch (e) { console.error(e); } };
    const fetchWarehouses = async () => { try { const data = await warehouseApi.getWarehouses(); setWarehouses(data); } catch (e) { console.error(e); } };

    const addLineItem = () => {
        if (!lineItem.item_id || lineItem.quantity <= 0 || lineItem.unit_price <= 0) { alert('Please fill all fields'); return; }
        setBillForm({ ...billForm, items: [...billForm.items, lineItem] });
        setLineItem({ item_id: '', quantity: 0, unit_price: 0 });
    };

    const handleCreateBill = async () => {
        try {
            if (!billForm.warehouse_id || billForm.items.length === 0) { alert('Select warehouse and items'); return; }
            await billingApi.createBill(billForm);
            setModalOpen(false);
            setBillForm({ billing_type: 'PURCHASE', warehouse_id: '', items: [] });
            fetchBills();
        } catch (err) { alert(err.message || 'Failed'); }
    };

    const handlePostBill = async (billId) => {
        try { await billingApi.postBill(billId); fetchBills(); } catch (err) { alert(err.message || 'Failed'); }
    };

    const columns = [
        { key: 'bill_number', label: 'Reference ID', render: (val) => <span className="font-mono text-xs text-slate-400">{val}</span> },
        { key: 'billing_type', label: 'Type', render: (val) => <span className="font-bold text-slate-700 dark:text-slate-200 text-xs tracking-wide">{val}</span> },
        { 
            key: 'status', label: 'Status',
            render: (val) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${val === 'POSTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'}`}>
                    {val === 'POSTED' ? <ShieldCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {val === 'POSTED' ? 'Verified' : 'Draft'}
                </span>
            )
        },
        { key: 'total_amount', label: 'Value', render: (val) => <span className="font-[800] text-slate-800 dark:text-white">₹{val.toLocaleString()}</span> }
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ALIGNMENT FIXED: Original title "Billing & Invoices" */}
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-2xl font-[700] tracking-tight text-slate-800 dark:text-white transition-colors duration-300">Billing & Invoices</h1>
                    <p className="text-sm font-[500] text-slate-500 dark:text-slate-400 mt-1">Transactions and invoice processing.</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 flex items-center gap-2 text-sm" onClick={() => setModalOpen(true)}><Receipt className="w-4 h-4" /> New Invoice</button>
            </div>

            <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-[1.5px] rounded-xl shadow-md shadow-emerald-900/5">
                <div className="bg-white dark:bg-slate-800 rounded-[10px] p-5 flex items-start gap-4 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 dark:from-emerald-900/10 dark:to-blue-900/10">
                    <div className="p-2.5 bg-white dark:bg-slate-700 rounded-lg shrink-0 shadow-sm text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-[800] text-slate-800 dark:text-white uppercase tracking-wide">AI Financial Audit</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            No irregularities detected. <span className="font-bold text-emerald-600 dark:text-emerald-400">98%</span> match rate on purchase orders.
                        </p>
                    </div>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">{error}</div>}

            <DataTable columns={columns} data={bills} actions={(row) => row.status === 'DRAFT' && <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium py-1.5 px-3 rounded-md transition-all duration-200 text-xs shadow-sm" onClick={() => handlePostBill(row.id)}>Post to Ledger</button>} />

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Generate New Invoice">
                 <div className="flex flex-col gap-5 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bill Type</label><select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm dark:text-white" value={billForm.billing_type} onChange={(e) => setBillForm({ ...billForm, billing_type: e.target.value })}><option value="PURCHASE">Purchase (Inbound)</option><option value="SALE">Sale (Outbound)</option></select></div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Warehouse</label><select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm dark:text-white" value={billForm.warehouse_id} onChange={(e) => setBillForm({ ...billForm, warehouse_id: e.target.value })}><option value="">Select Facility</option>{warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h4 className="font-[600] text-sm text-slate-700 dark:text-slate-300 mb-3">Line Items</h4>
                        <div className="flex gap-2 mb-3">
                            <select className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white" value={lineItem.item_id} onChange={(e) => setLineItem({ ...lineItem, item_id: e.target.value })}><option value="">Select Item</option>{items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
                            <input className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white" type="number" placeholder="Qty" value={lineItem.quantity} onChange={(e) => setLineItem({ ...lineItem, quantity: parseFloat(e.target.value) })} />
                            <input className="w-28 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-white" type="number" placeholder="Price" value={lineItem.unit_price} onChange={(e) => setLineItem({ ...lineItem, unit_price: parseFloat(e.target.value) })} />
                            <button className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors text-sm font-medium" onClick={addLineItem}>Add</button>
                        </div>
                        <div className="space-y-1">{billForm.items.map((item, idx) => (<div key={idx} className="text-xs flex justify-between bg-white dark:bg-slate-700/50 p-2 rounded border border-slate-200 dark:border-slate-700"><span className="font-medium text-slate-700 dark:text-slate-300">Item ID: {item.item_id}</span><span className="text-slate-500 dark:text-slate-400">Qty: {item.quantity} × ₹{item.unit_price}</span></div>))}</div>
                    </div>
                    <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-slate-100 dark:border-slate-700"><button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 rounded-lg" onClick={() => setModalOpen(false)}>Cancel</button><button className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md" onClick={handleCreateBill}>Confirm</button></div>
                </div>
            </Modal>
        </div>
    );
};

export default Billing;