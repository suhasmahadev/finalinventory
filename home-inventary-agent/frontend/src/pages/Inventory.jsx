import { useEffect, useState } from 'react';
import * as inventoryApi from '../api/inventoryApi';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Search, Package, AlertTriangle, DollarSign, Layers, Filter, Flame, TrendingDown } from 'lucide-react';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', sku: '', unit: 'pcs', reorder_threshold: 10 });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchItems = async () => {
        try {
            const data = await inventoryApi.getInventoryItems();
            setItems(data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleCreate = async () => {
        try {
            await inventoryApi.createItem(newItem);
            setIsCreateModalOpen(false);
            setNewItem({ name: '', sku: '', unit: 'pcs', reorder_threshold: 10 });
            fetchItems();
        } catch (err) { alert("Failed to create item"); }
    };

    const totalSKUs = items.length;
    const totalUnits = items.reduce((sum, item) => sum + (Number(item.total_stock) || 0), 0);
    const outOfStockCount = items.filter(item => (Number(item.total_stock) || 0) <= 0).length;
    const inventoryValue = (totalUnits * 125.50).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
        const stock = Number(item.total_stock) || 0;
        const threshold = Number(item.reorder_threshold) || 10;
        let matchesStatus = true;
        if (statusFilter === 'Healthy') matchesStatus = stock > threshold;
        if (statusFilter === 'Low') matchesStatus = stock > 0 && stock <= threshold;
        if (statusFilter === 'Out') matchesStatus = stock <= 0;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        { key: 'name', label: 'Name', render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-200">{val}</span> },
        { key: 'sku', label: 'SKU', render: (val) => <span className="font-mono text-xs text-slate-500">{val}</span> },
        { key: 'category', label: 'Category' },
        { 
            key: 'total_stock', label: 'AI Status',
            render: (val, row) => {
                const stock = Number(val) || 0;
                const threshold = Number(row.reorder_threshold) || 10;
                if (stock <= 0) return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-full text-[10px] font-bold uppercase tracking-wide"><AlertTriangle className="w-3 h-3" /> Critical</span>;
                if (stock <= threshold) return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full text-[10px] font-bold uppercase tracking-wide"><AlertTriangle className="w-3 h-3" /> Low Stock</span>;
                if (stock > 50) return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full text-[10px] font-bold uppercase tracking-wide"><Flame className="w-3 h-3" /> High Velocity</span>;
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wide"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Healthy</span>;
            }
        },
        { key: 'unit', label: 'Unit' },
    ];

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ALIGNMENT FIXED: Same spacing as dashboard, original title */}
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-2xl font-[700] tracking-tight text-slate-800 dark:text-white transition-colors duration-300">Inventory</h1>
                    <p className="text-sm font-[500] text-slate-500 dark:text-slate-400 mt-1">Manage catalog and view AI stock insights.</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 flex items-center gap-2 text-sm" onClick={() => setIsCreateModalOpen(true)}>+ Add Item</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: Layers, label: "Total SKUs", val: totalSKUs, color: "blue" },
                    { icon: Package, label: "Total Units", val: totalUnits.toLocaleString(), color: "emerald" },
                    { icon: AlertTriangle, label: "Stockout Risks", val: outOfStockCount, color: "red" },
                    { icon: DollarSign, label: "Est. Value", val: inventoryValue, color: "indigo" }
                ].map((kpi, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                        <div className={`w-12 h-12 rounded-full bg-${kpi.color}-50 dark:bg-${kpi.color}-900/30 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                            <kpi.icon className={`w-6 h-6 text-${kpi.color}-600 dark:text-${kpi.color}-400`} />
                        </div>
                        <div>
                            <div className="text-3xl font-[800] text-slate-800 dark:text-white tracking-tight">{kpi.val}</div>
                            <div className="text-[11px] font-[700] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col sm:flex-row gap-4 transition-colors duration-300">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search by name or SKU..." className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 transition-colors" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg"><Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" /></div>
                    <select className="py-2 px-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-900 text-sm font-[500] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Statuses</option>
                        <option value="Healthy">Healthy</option>
                        <option value="Low">Low Stock</option>
                        <option value="Out">Out of Stock</option>
                    </select>
                </div>
            </div>

            <DataTable columns={columns} data={filteredItems} actions={(row) => <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-[600] py-1.5 px-3 rounded-md transition-all duration-200 text-xs shadow-sm hover:shadow">Edit</button>} />

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Item">
                <div className="flex flex-col gap-5 mt-2">
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Item Name</label><input className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-white" placeholder="Enter item name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">SKU</label><input className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-white" placeholder="e.g. WH-123" value={newItem.sku} onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })} /></div>
                    <div className="flex gap-4">
                        <div className="flex-1"><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Unit</label><input className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-white" placeholder="e.g. kg, pcs" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} /></div>
                        <div className="flex-1"><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors">Reorder Level</label><input className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-white" type="number" placeholder="10" value={newItem.reorder_threshold} onChange={(e) => setNewItem({ ...newItem, reorder_threshold: e.target.value })} /></div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 transition-colors">
                        <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                        <button className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md" onClick={handleCreate}>Create Item</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Inventory;