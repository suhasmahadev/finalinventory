import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { Skeleton } from '../common/Skeleton';

const AnalyticsDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Static Data
    const revenueData = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 5000 },
        { name: 'Apr', value: 4500 },
        { name: 'May', value: 6000 },
        { name: 'Jun', value: 5500 },
        { name: 'Jul', value: 5500 },
    ];

    const categoryData = [
        { name: 'Electronics', value: 400 },
        { name: 'Furniture', value: 300 },
        { name: 'Apparel', value: 300 },
        { name: 'Food', value: 200 },
    ];

    const COLORS = ['#5d4037', '#8d6e63', '#a1887f', '#d7ccc8']; // Brown palette

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
                <div className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="glass-panel p-6 rounded-xl border border-beige-200">
                            <div className="flex justify-between items-start mb-4">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 rounded-xl border border-beige-200 h-96">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <Skeleton className="h-full w-full rounded-lg" />
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-beige-200 h-96">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <Skeleton className="h-full w-full rounded-full mx-auto" style={{ maxWidth: '300px' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brown-900">Analytics & Reports</h1>
                    <p className="text-brown-500 mt-1">Overview of your business performance.</p>
                </div>
                <div className="flex gap-2">
                    <select className="px-4 py-2 rounded-lg bg-white border border-beige-300 text-brown-700 outline-none focus:ring-2 focus:ring-brown-400">
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                        <option>All Time</option>
                    </select>
                    <button className="px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors shadow-md">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value="$28,500"
                    change="+12.5%"
                    icon={DollarSign}
                />
                <MetricCard
                    title="Total Orders"
                    value="1,240"
                    change="+5.2%"
                    icon={ShoppingBag}
                />
                <MetricCard
                    title="Avg. Order Value"
                    value="$85.20"
                    change="-2.1%"
                    icon={TrendingUp}
                />
                <MetricCard
                    title="Active Customers"
                    value="3,450"
                    change="+8.4%"
                    icon={Users}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                    <h3 className="text-lg font-bold text-brown-900 mb-6">Revenue Trend</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5dec3" />
                                <XAxis dataKey="name" stroke="#5d4037" />
                                <YAxis stroke="#5d4037" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#d7ccc8', borderRadius: '8px' }}
                                    itemStyle={{ color: '#5d4037' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#5d4037"
                                    strokeWidth={3}
                                    dot={{ fill: '#5d4037', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Sales */}
                <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                    <h3 className="text-lg font-bold text-brown-900 mb-6">Sales by Category</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#d7ccc8', borderRadius: '8px' }}
                                    itemStyle={{ color: '#5d4037' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, change, icon: Icon }) => {
    const isPositive = change.startsWith('+');
    return (
        <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-beige-100 rounded-lg text-brown-600">
                    <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-bold px-2 py-1 rounded ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {change}
                </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-brown-900">{value}</p>
        </div>
    );
};

export default AnalyticsDashboard;
