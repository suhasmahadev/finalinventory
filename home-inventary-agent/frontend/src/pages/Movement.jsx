import { useState, useEffect } from 'react';
import * as movementApi from '../api/movementApi';
import * as inventoryApi from '../api/inventoryApi';
import * as warehouseApi from '../api/warehouseApi';
import Modal from '../components/Modal';
import { Settings, Truck, Waypoints } from 'lucide-react';

const Movement = () => {
    const [items, setItems] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [adjustModalOpen, setAdjustModalOpen] = useState(false);
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [adjustForm, setAdjustForm] = useState({ batch_id: '', adjustment_quantity: 0, reason: '' });
    const [transferForm, setTransferForm] = useState({ batch_id: '', target_room_id: '', quantity: 0 });

    useEffect(() => {
        const loadData = async () => { try { const iData = await inventoryApi.getItems(); setItems(iData); const wData = await warehouseApi.getWarehouses(); setWarehouses(wData); } catch (e) { console.error(e); } };
        loadData();
    }, []);

    const handleAdjust = async () => { try { await movementApi.adjustStock(adjustForm); setAdjustModalOpen(false); setAdjustForm({ batch_id: '', adjustment_quantity: 0, reason: '' }); alert('Stock adjusted'); } catch (err) { alert(err.message || 'Failed'); } };
    const handleTransfer = async () => { try { await movementApi.transferStock(transferForm); setTransferModalOpen(false); setTransferForm({ batch_id: '', target_room_id: '', quantity: 0 }); alert('Stock transferred'); } catch (err) { alert(err.message || 'Failed'); } };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* ALIGNMENT FIXED: Original title "Stock Movement" */}
             <div className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-2xl font-[700] tracking-tight text-slate-800 dark:text-white transition-colors duration-300">Stock Movement</h1>
                    <p className="text-sm font-[500] text-slate-500 dark:text-slate-400 mt-1">Stock transfers and fleet management.</p>
                </div>
            </div>

            <div className="relative w-full h-32 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden flex items-center justify-between px-10 shadow-inner group">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="flex flex-col z-10">
                     <h3 className="text-base font-[700] text-slate-700 dark:text-slate-300 tracking-tight flex items-center gap-2"><Waypoints className="w-5 h-5 text-emerald-500" /> Route Optimization Active</h3>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Analyzing traffic and warehouse capacity.</p>
                </div>
                <div className="flex items-center gap-1 opacity-40">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-10 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></div>
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-1.5 h-8 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => setAdjustModalOpen(true)} className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex items-start gap-6 relative overflow-hidden">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Settings className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-[700] text-slate-800 dark:text-white mb-2">Stock Correction</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Manual override for damaged or lost inventory.</p>
                        <span className="inline-block mt-4 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider group-hover:underline">Calibrate &rarr;</span>
                    </div>
                </div>

                <div onClick={() => setTransferModalOpen(true)} className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex items-start gap-6 relative">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Truck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-[700] text-slate-800 dark:text-white mb-2">Smart Transfer</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Move inventory between facilities with AI routing.</p>
                        <span className="inline-block mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider group-hover:underline">Initiate Move &rarr;</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md">AI Recommended</div>
                </div>
            </div>

            <Modal isOpen={adjustModalOpen} onClose={() => setAdjustModalOpen(false)} title="Manual Stock Adjustment">
                <div className="flex flex-col gap-4 mt-2">
                    <input className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm dark:text-white" placeholder="Batch ID" value={adjustForm.batch_id} onChange={(e) => setAdjustForm({ ...adjustForm, batch_id: e.target.value })} />
                    <input className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm dark:text-white" type="number" placeholder="+ or -" value={adjustForm.adjustment_quantity} onChange={(e) => setAdjustForm({ ...adjustForm, adjustment_quantity: parseFloat(e.target.value) })} />
                    <input className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm dark:text-white" placeholder="Reason" value={adjustForm.reason} onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })} />
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg" onClick={() => setAdjustModalOpen(false)}>Cancel</button>
                        <button className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-md" onClick={handleAdjust}>Adjust</button>
                    </div>
                </div>
            </Modal>
            
            <Modal isOpen={transferModalOpen} onClose={() => setTransferModalOpen(false)} title="Smart Stock Transfer">
                <div className="flex flex-col gap-4 mt-2">
                    <input className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm dark:text-white" placeholder="Batch ID" value={transferForm.batch_id} onChange={(e) => setTransferForm({ ...transferForm, batch_id: e.target.value })} />
                    <input className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm dark:text-white" placeholder="Target Room ID" value={transferForm.target_room_id} onChange={(e) => setTransferForm({ ...transferForm, target_room_id: e.target.value })} />
                    <input className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm dark:text-white" type="number" placeholder="Quantity" value={transferForm.quantity} onChange={(e) => setTransferForm({ ...transferForm, quantity: parseFloat(e.target.value) })} />
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg" onClick={() => setTransferModalOpen(false)}>Cancel</button>
                        <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md" onClick={handleTransfer}>Transfer</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Movement;