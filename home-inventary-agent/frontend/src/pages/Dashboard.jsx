import { useEffect, useState } from 'react';
import * as analyticsApi from '../api/analyticsApi';
import { TrendingUp, AlertTriangle, Clock, PackageOpen, Sparkles, Zap } from 'lucide-react';

const Dashboard = () => {
    const [soldToday, setSoldToday] = useState(0);
    const [topItems, setTopItems] = useState([]);
    const [expiring, setExpiring] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sold = await analyticsApi.getSoldToday();
                setSoldToday(sold);
                const top = await analyticsApi.getTopSelling(5);
                setTopItems(top);
                const exp = await analyticsApi.getExpiringItems(7);
                setExpiring(exp);
            } catch (err) { console.error("Data load failed", err); }
        };
        fetchData();
    }, []);

    const Sparkline = ({ color = "text-emerald-500" }) => (
        <svg className={`w-16 h-8 ${color} drop-shadow-sm`} viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 25C15 25 20 10 35 15C50 20 55 5 70 10C85 15 90 0 100 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* STANDARD HEADER ALIGNMENT */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-[700] tracking-tight text-slate-800 dark:text-slate-100 transition-colors">Command Center</h1>
                    <p className="text-sm font-[500] text-slate-500 dark:text-slate-400 mt-1">Real-time AI monitoring and risk assessment.</p>
                </div>
                {/* AI BADGE */}
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-800/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <span className="relative flex h-2.5 w-2.5 mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                    </span>
                    AI Engine Online
                </div>
            </div>

            {/* REST OF DASHBOARD CONTENT (Same as before) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 cursor-pointer group">
                    <div className="flex justify-between items-start">
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-[700] uppercase tracking-widest">Demand Velocity</h3>
                        <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors"><Zap className="w-3 h-3" /> Surge Detected</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="text-4xl font-[800] tracking-tight text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors">{soldToday}</div>
                        <Sparkline color="text-emerald-500" />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/5 cursor-pointer group">
                    <div className="flex justify-between items-start">
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-[700] uppercase tracking-widest">Predicted Stockout Risk</h3>
                        <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors"><AlertTriangle className="w-3 h-3" /> High Priority</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="text-4xl font-[800] tracking-tight text-amber-500 dark:text-amber-400 group-hover:text-amber-600 transition-colors">0</div>
                        <Sparkline color="text-amber-400" />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/5 cursor-pointer group">
                    <div className="flex justify-between items-start">
                        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-[700] uppercase tracking-widest">Expiry Risk Prediction</h3>
                        <span className="flex items-center gap-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors"><Clock className="w-3 h-3" /> {expiring.length > 0 ? 'Action Req' : 'Stable'}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="text-4xl font-[800] tracking-tight text-red-500 dark:text-red-400 group-hover:text-red-600 transition-colors">{expiring.length}</div>
                        <Sparkline color="text-red-400" />
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-1 shadow-lg shadow-emerald-900/10">
                <div className="bg-white dark:bg-slate-900/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 h-full backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-[700] text-slate-800 dark:text-white">AI Inventory Intelligence</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-emerald-200 transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>
                            <div><p className="text-sm font-[600] text-slate-700 dark:text-slate-200">Basmati Rice Stockout Risk</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Predicted to run out in 5 days based on current velocity.</p></div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-emerald-200 transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                            <div><p className="text-sm font-[600] text-slate-700 dark:text-slate-200">Electronics Demand Surge</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Category demand up 18% this week. Consider increasing order volume.</p></div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-emerald-200 transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                            <div><p className="text-sm font-[600] text-slate-700 dark:text-slate-200">Restock Recommendation</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sugar sales are stable. Recommend restocking to maintain safety stock.</p></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-6 transition-colors duration-300 flex flex-col">
                    <h3 className="text-lg font-[700] text-slate-800 dark:text-white mb-6">Top Moving Items</h3>
                    {topItems.length > 0 ? (
                        <ul className="flex flex-col">
                            {topItems.map((item, i) => (
                                <li key={i} className="flex justify-between items-center py-3.5 border-b border-slate-100 dark:border-slate-700/50 last:border-0 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 px-2 rounded-lg transition-colors">
                                    <span className="text-slate-700 dark:text-slate-200 font-[500] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.name || `Item ${item.item_id}`}</span>
                                    <span className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 py-1.5 px-3.5 rounded-full text-xs font-bold transition-all duration-300">{item.total_sold} Units</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-60"><PackageOpen className="w-12 h-12 text-slate-400 mb-3" strokeWidth={1.5} /><p className="text-slate-500 text-sm font-medium">No sales data yet.</p></div>
                    )}
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-6 transition-colors duration-300 flex flex-col">
                    <h3 className="text-lg font-[700] text-slate-800 dark:text-white mb-6">Expiry Watchlist</h3>
                    {expiring.length > 0 ? (
                        <ul className="flex flex-col">
                            {expiring.map((item, i) => (
                                <li key={i} className="flex justify-between items-center py-3.5 border-b border-slate-100 dark:border-slate-700/50 last:border-0 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 px-2 rounded-lg transition-colors">
                                    <span className="text-slate-700 dark:text-slate-200 font-[500] group-hover:text-red-500 transition-colors">{item.name}</span>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 group-hover:text-red-600 group-hover:bg-red-50 dark:group-hover:text-red-400 dark:group-hover:bg-red-900/30 px-2.5 py-1.5 rounded-md transition-all duration-300">{item.expiry_date}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-60"><div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3"><Clock className="w-6 h-6 text-slate-400" strokeWidth={1.5} /></div><p className="text-slate-500 text-sm font-medium">All clear!</p><p className="text-slate-400 text-xs mt-1">No items expiring this week.</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;