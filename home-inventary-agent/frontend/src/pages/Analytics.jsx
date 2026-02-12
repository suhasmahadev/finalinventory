import { useEffect, useState } from 'react';
import * as analyticsApi from '../api/analyticsApi';
import DataTable from '../components/DataTable';
import { TrendingUp, DollarSign, Activity, CreditCard, Sparkles } from 'lucide-react';

const Analytics = () => {
    const [leastSelling, setLeastSelling] = useState([]);

    useEffect(() => {
        analyticsApi.getLeastSelling()
            .then(data => setLeastSelling(data || []))
            .catch(err => {
                console.error("API Error:", err);
                setLeastSelling([]); 
            });
    }, []);

    // DEMO DATA
    const salesData = [
        { name: 'Jan', revenue: '420', height: '40%' }, 
        { name: 'Feb', revenue: '380', height: '35%' },
        { name: 'Mar', revenue: '510', height: '55%' }, 
        { name: 'Apr', revenue: '490', height: '50%' },
        { name: 'May', revenue: '650', height: '75%' }, 
        { name: 'Jun', revenue: '820', height: '100%' },
    ];
    const categoryData = [
        { name: 'Electronics', value: 45, color: 'bg-emerald-500' }, 
        { name: 'Apparel', value: 25, color: 'bg-blue-500' },
        { name: 'Home Goods', value: 20, color: 'bg-amber-500' }, 
        { name: 'Accessories', value: 10, color: 'bg-purple-500' },
    ];
    const topProductsData = [
        { name: 'Pro Laptop', units: 124, width: '100%' }, 
        { name: 'Wireless Mouse', units: 98, width: '80%' },
        { name: 'Desk Mat', units: 85, width: '70%' }, 
        { name: 'USB-C Hub', units: 72, width: '60%' },
        { name: 'Monitor Arm', units: 64, width: '50%' },
    ];

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ALIGNMENT FIXED */}
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-2xl font-[700] tracking-tight text-slate-800 dark:text-white transition-colors duration-300">Analytics & Reports</h1>
                    <p className="text-sm font-[500] text-slate-500 dark:text-slate-400 mt-1">Financial overview and inventory performance metrics.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-[600] text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg shadow-sm">Last 6 Months</div>
            </div>

            <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-[1.5px] rounded-xl shadow-md shadow-emerald-900/5">
                <div className="bg-white dark:bg-slate-800 rounded-[10px] p-5 flex items-start gap-4 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 dark:from-emerald-900/10 dark:to-blue-900/10">
                    <div className="p-2.5 bg-white dark:bg-slate-700 rounded-lg shrink-0 shadow-sm text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-[800] text-slate-800 dark:text-white uppercase tracking-wide">AI Executive Summary</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            Revenue increased <span className="font-bold text-emerald-600 dark:text-emerald-400">14% MoM</span> driven by strong performance in the <span className="font-semibold">Electronics</span> category. Apparel is currently underperforming benchmarks; recommend reviewing pricing strategy for Q3.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: DollarSign, color: "emerald", label: "Revenue Today", val: "₹84,500", trend: "+8.4%" },
                    { icon: Activity, color: "blue", label: "Revenue This Month", val: "₹24.5L", trend: "+14.2%" },
                    { icon: TrendingUp, color: "indigo", label: "YTD Growth", val: "28.4%", trend: null },
                    { icon: CreditCard, color: "amber", label: "Avg. Order Value", val: "₹1,250", trend: null },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group">
                        <div className="flex justify-between items-start">
                            <div className={`w-10 h-10 rounded-full bg-${item.color}-50 dark:bg-${item.color}-900/30 flex items-center justify-center`}>
                                <item.icon className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                            </div>
                            {item.trend && <span className={`flex items-center gap-1 text-${item.color}-600 dark:text-${item.color}-400 text-xs font-bold bg-${item.color}-50 dark:bg-${item.color}-900/30 px-2 py-1 rounded-full`}><TrendingUp className="w-3 h-3" /> {item.trend}</span>}
                        </div>
                        <div>
                            <div className="text-slate-500 dark:text-slate-400 text-xs font-[700] uppercase tracking-widest mb-1">{item.label}</div>
                            <div className="text-3xl font-[800] text-slate-800 dark:text-white">{item.val}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm transition-colors duration-300 flex flex-col hover:shadow-md">
                    <h3 className="text-lg font-[700] text-slate-800 dark:text-white mb-2">Revenue Trend (6 Months)</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 pt-10">
                        {salesData.map((data, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 flex-1 group">
                                <div className="w-full relative flex justify-center items-end h-48 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs py-1.5 px-2.5 rounded-lg shadow-lg pointer-events-none z-10 whitespace-nowrap font-bold">₹{data.revenue}k</div>
                                    <div className="w-full bg-emerald-500/80 group-hover:bg-emerald-500 rounded-b-sm rounded-t-lg transition-all duration-500 shadow-inner" style={{ height: data.height }}></div>
                                </div>
                                <span className="text-xs font-[600] text-slate-500 dark:text-slate-400 uppercase">{data.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm transition-colors duration-300 hover:shadow-md">
                    <h3 className="text-lg font-[700] text-slate-800 dark:text-white mb-6">Sales by Category</h3>
                    <div className="flex flex-col gap-5 mt-4">
                        {categoryData.map((cat, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-[600] text-slate-700 dark:text-slate-300">{cat.name}</span>
                                    <span className="font-[700] text-slate-800 dark:text-white">{cat.value}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                                    <div className={`h-full rounded-full ${cat.color} transition-all duration-1000 ease-out`} style={{ width: `${cat.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm transition-colors duration-300 hover:shadow-md">
                    <h3 className="text-lg font-[700] text-slate-800 dark:text-white mb-6">Top 5 Products by Volume</h3>
                    <div className="flex flex-col gap-4 mt-2">
                        {topProductsData.map((prod, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-default">
                                <div className="w-28 text-sm font-[600] text-slate-600 dark:text-slate-400 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{prod.name}</div>
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="h-7 bg-slate-50 dark:bg-slate-900/50 rounded-md overflow-hidden flex-1 relative border border-slate-100 dark:border-slate-800">
                                        <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-md transition-all duration-1000 ease-out shadow-sm" style={{ width: prod.width }}></div>
                                    </div>
                                    <div className="w-8 text-right text-sm font-[700] text-slate-700 dark:text-slate-300">{prod.units}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm transition-colors duration-300 flex flex-col hover:shadow-md">
                    <h3 className="text-lg font-[700] text-slate-800 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">Action Required: Least Selling Items</h3>
                    <div className="flex-1 overflow-auto">
                        <DataTable columns={[{ key: 'name', label: 'Item Name' }, { key: 'total_sold', label: 'Sold Count', render: (val) => <span className="text-red-500 font-bold bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md">{val}</span> }]} data={leastSelling || []} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;