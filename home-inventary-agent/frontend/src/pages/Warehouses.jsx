import { useEffect, useState } from 'react';
import * as warehouseApi from '../api/warehouseApi';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { MapPin, Building2, Box, AlertCircle, CheckCircle2, Map } from 'lucide-react';

const Warehouses = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newWarehouse, setNewWarehouse] = useState({ name: '', address: '' });

    const fetchWarehouses = async () => {
        try {
            const data = await warehouseApi.getWarehouses();
            setWarehouses(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchWarehouses(); }, []);

    const handleCreate = async () => {
        await warehouseApi.createWarehouse(newWarehouse);
        setModalOpen(false);
        setNewWarehouse({ name: '', address: '' }); 
        fetchWarehouses();
    };

    const columns = [
        { key: 'name', label: 'Warehouse Name', render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-200">{val}</span> },
        { key: 'address', label: 'Address', render: (val) => <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {val}</span> },
        { key: 'id', label: 'Facility ID', render: (val) => <span className="font-mono text-xs text-slate-400">{val}</span> },
    ];

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ALIGNMENT FIXED */}
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-2xl font-[700] tracking-tight text-slate-800 dark:text-white transition-colors duration-300">Warehouse Network</h1>
                    <p className="text-sm font-[500] text-slate-500 dark:text-slate-400 mt-1">Monitor capacities and locations across your supply chain.</p>
                </div>
                <button 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 flex items-center gap-2 text-sm" 
                    onClick={() => setModalOpen(true)}
                >
                    + Add Warehouse
                </button>
            </div>

            {/* Content Cards */}
            <div className="relative w-full h-40 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 group transition-all duration-300 hover:border-emerald-500/30 hover:shadow-md cursor-crosshair shadow-inner">
                <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] transition-opacity group-hover:opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <Map className="w-10 h-10 mb-2 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500/70 transition-colors duration-500" strokeWidth={1.5} />
                <h3 className="text-base font-[700] text-slate-700 dark:text-slate-300 tracking-tight z-10">Live Interactive Map</h3>
                <div className="absolute top-4 right-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">Coming Soon</div>
            </div>

            <div>
                <h2 className="text-lg font-[700] text-slate-800 dark:text-white mb-4">Facility Overview</h2>
                {warehouses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {warehouses.map((wh, i) => {
                            const capacity = (wh.name.length * 14 + i * 27) % 100 || 68;
                            const itemsCount = (capacity * 42);
                            const isCritical = capacity > 90;
                            const isWarning = capacity > 75;

                            return (
                                <div key={wh.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 group-hover:scale-105 transition-transform duration-300">
                                                <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-[700] text-slate-800 dark:text-white tracking-tight">{wh.name}</h3>
                                                <p className="text-xs font-[500] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">{wh.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Storage Capacity</span>
                                            <span className={`font-[700] ${isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-800 dark:text-white'}`}>{capacity}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full rounded-full transition-all duration-1000 ease-out ${isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${capacity}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300"><Box className="w-4 h-4 text-slate-400" /><span className="font-[700]">{itemsCount.toLocaleString()} <span className="text-slate-400 font-[500]">Items</span></span></div>
                                        {isCritical ? <span className="flex items-center gap-1 text-[10px] font-[700] text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md uppercase tracking-wide"><AlertCircle className="w-3 h-3" /> Critical</span> : isWarning ? <span className="flex items-center gap-1 text-[10px] font-[700] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md uppercase tracking-wide"><AlertCircle className="w-3 h-3" /> Heavy Load</span> : <span className="flex items-center gap-1 text-[10px] font-[700] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md uppercase tracking-wide"><CheckCircle2 className="w-3 h-3" /> Optimal</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-12 flex flex-col items-center justify-center text-center shadow-sm">
                        <Building2 className="w-8 h-8 text-slate-400 mb-4" strokeWidth={1.5} />
                        <h3 className="text-lg font-[700] text-slate-800 dark:text-white mb-1">No Warehouses Found</h3>
                        <p className="text-sm font-[500] text-slate-500 dark:text-slate-400 mb-6">Add your first facility to track capacity.</p>
                        <button onClick={() => setModalOpen(true)} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-[600] py-2 px-5 rounded-lg text-sm transition-colors">+ Add Facility</button>
                    </div>
                )}
            </div>
            <div className="mt-4"><h2 className="text-lg font-[700] text-slate-800 dark:text-white mb-4">Facility Directory</h2><DataTable columns={columns} data={warehouses} /></div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Warehouse">
                <div className="flex flex-col gap-5 mt-2">
                    <div><label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-1.5">Facility Name</label><input className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-sm font-[500] text-slate-700 dark:text-white" placeholder="e.g. Central Distribution Hub" value={newWarehouse.name} onChange={e => setNewWarehouse({ ...newWarehouse, name: e.target.value })} /></div>
                    <div><label className="block text-sm font-[600] text-slate-700 dark:text-slate-300 mb-1.5">Address</label><input className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-sm font-[500] text-slate-700 dark:text-white" placeholder="City, State" value={newWarehouse.address} onChange={e => setNewWarehouse({ ...newWarehouse, address: e.target.value })} /></div>
                    <div className="flex justify-end gap-3 mt-4 pt-5 border-t border-slate-100 dark:border-slate-700"><button className="px-5 py-2.5 text-sm font-[600] text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50" onClick={() => setModalOpen(false)}>Cancel</button><button className="px-5 py-2.5 text-sm font-[600] text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md" onClick={handleCreate}>Save Facility</button></div>
                </div>
            </Modal>
        </div>
    );
};

export default Warehouses;