import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Warehouse, AlertTriangle, CheckCircle, Package } from 'lucide-react';

const WarehouseDashboard = () => {
    // Static Data
    const zoneData = [
        { name: 'Zone A (Electronics)', used: 85, capacity: 100 },
        { name: 'Zone B (Furniture)', used: 45, capacity: 80 },
        { name: 'Zone C (Apparel)', used: 90, capacity: 120 },
        { name: 'Zone D (Cold Store)', used: 30, capacity: 50 },
    ];

    const stockHealthData = [
        { name: 'In Stock', value: 850 },
        { name: 'Low Stock', value: 120 },
        { name: 'Out of Stock', value: 45 },
    ];

    const COLORS = ['#5d4037', '#a1887f', '#d7ccc8']; // Brown shades

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brown-900">Warehouse Operations</h1>
                    <p className="text-brown-500 mt-1">Real-time overview of storage capacity and stock health.</p>
                </div>
                <button className="px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors shadow-md">
                    Schedule Audit
                </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Capacity" value="3,500 Units" icon={Warehouse} />
                <StatCard title="Current Usage" value="2,150 Units" subtext="61% Full" icon={Package} />
                <StatCard title="Low Stock Items" value="24 Items" alert icon={AlertTriangle} />
                <StatCard title="Audit Status" value="Compliant" subtext="Last checked: 2d ago" icon={CheckCircle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Zone Capacity Chart */}
                <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                    <h3 className="text-lg font-bold text-brown-900 mb-6">Zone Utilization</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={zoneData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5dec3" horizontal={false} />
                                <XAxis type="number" stroke="#5d4037" />
                                <YAxis dataKey="name" type="category" width={120} stroke="#5d4037" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#d7ccc8', borderRadius: '8px' }}
                                    cursor={{ fill: '#f7f3e8' }}
                                />
                                <Legend />
                                <Bar dataKey="used" name="Used Space" stackId="a" fill="#5d4037" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="capacity" name="Total Capacity" stackId="a" fill="#e5dec3" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stock Health Chart */}
                <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                    <h3 className="text-lg font-bold text-brown-900 mb-6">Stock Health Overview</h3>
                    <div className="h-80 relative">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="text-3xl font-bold text-brown-900">1,015</span>
                                <p className="text-sm text-brown-500">Total SKUs</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stockHealthData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stockHealthData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 2 ? '#ef4444' : index === 1 ? '#f59e0b' : '#5d4037'} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#d7ccc8', borderRadius: '8px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Alerts */}
            <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                <h3 className="text-lg font-bold text-brown-900 mb-4">Critical Stock Alerts</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-beige-200">
                                <th className="pb-3 pt-2 font-semibold text-brown-700">Item Name</th>
                                <th className="pb-3 pt-2 font-semibold text-brown-700">SKU</th>
                                <th className="pb-3 pt-2 font-semibold text-brown-700">Current Stock</th>
                                <th className="pb-3 pt-2 font-semibold text-brown-700">Reorder Level</th>
                                <th className="pb-3 pt-2 font-semibold text-brown-700">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige-100">
                            {[1, 2, 3].map((_, i) => (
                                <tr key={i} className="hover:bg-beige-50/50">
                                    <td className="py-3 text-brown-900 font-medium">Premium Leather Chair</td>
                                    <td className="py-3 text-brown-600 font-mono text-sm">FUR-00{i + 1}</td>
                                    <td className="py-3 text-brown-800">5</td>
                                    <td className="py-3 text-brown-600">10</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                                            Low Stock
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, subtext, icon: Icon, alert }) => (
    <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-brown-500">{title}</h3>
            <div className={`p-2 rounded-lg ${alert ? 'bg-red-100 text-red-600' : 'bg-beige-100 text-brown-600'}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <p className={`text-2xl font-bold ${alert ? 'text-red-600' : 'text-brown-900'}`}>{value}</p>
        {(subtext) && <p className="text-xs text-brown-400 mt-1">{subtext}</p>}
    </div>
);

export default WarehouseDashboard;
