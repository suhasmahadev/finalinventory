import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Receipt, DollarSign, CreditCard, Clock } from 'lucide-react';

const BillingDashboard = () => {
    // Static Data
    const expenseData = [
        { name: 'Mon', amount: 1200 },
        { name: 'Tue', amount: 950 },
        { name: 'Wed', amount: 1500 },
        { name: 'Thu', amount: 800 },
        { name: 'Fri', amount: 2100 },
        { name: 'Sat', amount: 1800 },
        { name: 'Sun', amount: 400 },
    ];

    const invoiceStatus = [
        { name: 'Paid', value: 65 },
        { name: 'Pending', value: 25 },
        { name: 'Overdue', value: 10 },
    ];

    const COLORS = ['#5d4037', '#a1887f', '#ef4444'];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brown-900">Billing & Invoicing</h1>
                    <p className="text-brown-500 mt-1">Manage finances, invoices, and expense tracking.</p>
                </div>
                <button className="px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors shadow-md flex items-center gap-2">
                    <span className="text-lg">+</span> Create Invoice
                </button>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BillCard title="Total Revenue (Monthly)" value="$42,500" icon={DollarSign} />
                <BillCard title="Outstanding Invoices" value="$3,200" subtext="5 Invoices Pending" alert icon={Clock} />
                <BillCard title="Total Expenses" value="$12,150" subtext="-8% vs last month" icon={CreditCard} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Expenses */}
                <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                    <h3 className="text-lg font-bold text-brown-900 mb-6">Weekly Expense Tracking</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={expenseData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5dec3" vertical={false} />
                                <XAxis dataKey="name" stroke="#5d4037" />
                                <YAxis stroke="#5d4037" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderColor: '#d7ccc8', borderRadius: '8px' }}
                                    cursor={{ fill: '#f7f3e8' }}
                                    formatter={(value) => [`$${value}`, 'Amount']}
                                />
                                <Bar dataKey="amount" fill="#8d6e63" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Invoice Status */}
                <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-brown-900 mb-2 w-full text-left">Invoice Status Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={invoiceStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {invoiceStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Invoices Table */}
            <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-brown-900">Recent Invoices</h3>
                    <button className="text-brown-600 text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-beige-200 text-sm text-brown-500">
                                <th className="pb-3 pl-2">Invoice ID</th>
                                <th className="pb-3">Client</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Amount</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3 text-right pr-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige-100 text-sm">
                            {[
                                { id: 'INV-001', client: 'Acme Corp', date: 'Oct 24, 2024', amount: '$1,200', status: 'Paid' },
                                { id: 'INV-002', client: 'Globex Inc', date: 'Oct 22, 2024', amount: '$850', status: 'Pending' },
                                { id: 'INV-003', client: 'Soylent Corp', date: 'Oct 20, 2024', amount: '$2,300', status: 'Overdue' },
                            ].map((inv, i) => (
                                <tr key={i} className="hover:bg-beige-50/50 transition-colors">
                                    <td className="py-3 pl-2 font-mono text-brown-600">{inv.id}</td>
                                    <td className="py-3 font-medium text-brown-900">{inv.client}</td>
                                    <td className="py-3 text-brown-500">{inv.date}</td>
                                    <td className="py-3 font-bold text-brown-800">{inv.amount}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${inv.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' :
                                                inv.status === 'Pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                    'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right pr-2 text-brown-500 cursor-pointer hover:text-brown-800">
                                        View
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

const BillCard = ({ title, value, subtext, icon: Icon, alert }) => (
    <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 p-4 opacity-5">
            <Icon className="w-24 h-24 -rotate-12" />
        </div>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${alert ? 'bg-red-100 text-red-600' : 'bg-brown-100 text-brown-600'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-medium text-brown-600">{title}</h3>
            </div>
            <p className="text-3xl font-bold text-brown-900">{value}</p>
            {subtext && <p className={`text-xs mt-1 ${alert ? 'text-red-500 font-bold' : 'text-brown-400'}`}>{subtext}</p>}
        </div>
    </div>
);

export default BillingDashboard;
