import React from 'react';
import { Package, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell
} from 'recharts';

const InventoryDashboard = () => {
    // Static Data
    const stockValueData = [
        { month: 'Jan', value: 45000 },
        { month: 'Feb', value: 52000 },
        { month: 'Mar', value: 48000 },
        { month: 'Apr', value: 61000 },
        { month: 'May', value: 58000 },
        { month: 'Jun', value: 65000 },
    ];

    const categoryData = [
        { name: 'Electronics', count: 120 },
        { name: 'Furniture', count: 85 },
        { name: 'Apparel', count: 200 },
        { name: 'Groceries', count: 350 },
        { name: 'Toys', count: 95 },
    ];

    const COLORS = ['#5d4037', '#8d6e63', '#d7ccc8', '#efebe9', '#a1887f'];

    const recentAdjustments = [
        { id: 1, item: 'Office Chair', type: 'in', quantity: 50, date: '2 mins ago' },
        { id: 2, item: 'Wireless Mouse', type: 'out', quantity: 12, date: '15 mins ago' },
        { id: 3, item: 'Ladder', type: 'in', quantity: 5, date: '1 hour ago' },
        { id: 4, item: 'USB Cable', type: 'out', quantity: 25, date: '3 hours ago' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brown-900">Inventory Management</h1>
                    <p className="text-brown-500 mt-1">Real-time overview of stock levels, value, and adjustments.</p>
                </div>
                <button className="px-4 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded-lg shadow-md transition-all">
                    + Add New Stock
                </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard title="Total Items" value="1,245" subtext="+120 this month" icon={Package} trend="up" />
                <MetricCard title="Total Value" value="$65,400" subtext="+8.5% growth" icon={DollarSign} trend="up" />
                <MetricCard title="Low Stock" value="15" subtext="Requires attention" icon={AlertTriangle} trend="down" isWarning />
                <MetricCard title="Stock Turnover" value="4.2x" subtext="Annualized" icon={TrendingUp} trend="up" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stock Value Trend */}
                <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                    <h3 className="text-lg font-bold text-brown-900 mb-6">Inventory Value Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stockValueData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5d4037" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#5d4037" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5dec3" vertical={false} />
                                <XAxis dataKey="month" stroke="#5d4037" tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#5d4037" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#d7ccc8', borderRadius: '8px' }}
                                    formatter={(value) => [`$${value}`, 'Value']}
                                />
                                <Area type="monotone" dataKey="value" stroke="#5d4037" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                    <h3 className="text-lg font-bold text-brown-900 mb-6">Items by Category</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5dec3" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#5d4037" hide />
                                <YAxis dataKey="name" type="category" stroke="#5d4037" width={100} tick={{ fontSize: 12, fontWeight: 500 }} />
                                <Tooltip cursor={{ fill: '#f5f5f4' }} contentStyle={{ backgroundColor: '#fff', borderColor: '#d7ccc8', borderRadius: '8px' }} />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Adjustments */}
            <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                <h3 className="text-lg font-bold text-brown-900 mb-4">Recent Stock Adjustments</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-beige-200 text-brown-500 text-sm">
                                <th className="py-3 font-medium">Item Name</th>
                                <th className="py-3 font-medium">Type</th>
                                <th className="py-3 font-medium">Quantity</th>
                                <th className="py-3 font-medium text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige-100">
                            {recentAdjustments.map((adj) => (
                                <tr key={adj.id} className="group hover:bg-beige-50 transition-colors">
                                    <td className="py-4 font-medium text-brown-800">{adj.item}</td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${adj.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {adj.type === 'in' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                            {adj.type === 'in' ? 'Stock In' : 'Stock Out'}
                                        </span>
                                    </td>
                                    <td className="py-4 text-brown-600">{adj.quantity} units</td>
                                    <td className="py-4 text-right text-brown-400 text-sm">{adj.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, subtext, icon: Icon, trend, isWarning }) => (
    <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-brown-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-brown-900">{value}</h3>
            <div className={`flex items-center gap-1 text-xs mt-2 font-medium ${isWarning ? 'text-red-500' : 'text-green-600'
                }`}>
                {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {subtext}
            </div>
        </div>
        <div className={`p-3 rounded-full ${isWarning ? 'bg-red-50 text-red-500' : 'bg-beige-100 text-brown-600'
            }`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

export default InventoryDashboard;
