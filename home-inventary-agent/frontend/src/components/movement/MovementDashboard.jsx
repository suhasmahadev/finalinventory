import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { ArrowLeftRight, Truck, MapPin, Package } from 'lucide-react';

const MovementDashboard = () => {
    // Static Data
    const movementData = [
        { name: 'Mon', inbound: 120, outbound: 80 },
        { name: 'Tue', inbound: 150, outbound: 100 },
        { name: 'Wed', inbound: 180, outbound: 200 },
        { name: 'Thu', inbound: 90, outbound: 150 },
        { name: 'Fri', inbound: 250, outbound: 180 },
        { name: 'Sat', inbound: 100, outbound: 60 },
        { name: 'Sun', inbound: 50, outbound: 30 },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brown-900">Stock Movement</h1>
                    <p className="text-brown-500 mt-1">Track inventory flow, transfers, and logistics.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-beige-300 text-brown-700 rounded-lg hover:bg-beige-50">
                        History
                    </button>
                    <button className="px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 shadow-md">
                        New Transfer
                    </button>
                </div>
            </div>

            {/* Movement Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MoveCard title="Inbound Today" value="340 Items" subtext="12 Shipments" icon={Truck} color="green" />
                <MoveCard title="Outbound Today" value="215 Items" subtext="8 Orders Dispatched" icon={Package} color="blue" />
                <MoveCard title="Pending Transfers" value="3 Active" subtext="Wait time: 4h avg" icon={ArrowLeftRight} color="orange" />
            </div>

            {/* Graphical Flow */}
            <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                <h3 className="text-lg font-bold text-brown-900 mb-6">Weekly Inventory Flow</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={movementData}>
                            <defs>
                                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#5d4037" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#5d4037" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a1887f" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#a1887f" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5dec3" />
                            <XAxis dataKey="name" stroke="#5d4037" />
                            <YAxis stroke="#5d4037" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderColor: '#d7ccc8', borderRadius: '8px' }}
                            />
                            <Area type="monotone" dataKey="inbound" stroke="#5d4037" fillOpacity={1} fill="url(#colorIn)" name="Inbound" />
                            <Area type="monotone" dataKey="outbound" stroke="#a1887f" fillOpacity={1} fill="url(#colorOut)" name="Outbound" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Movements List */}
            <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm">
                <h3 className="text-lg font-bold text-brown-900 mb-4">Live Movement Feed</h3>
                <div className="space-y-4">
                    {[
                        { type: 'Inbound', item: 'Office Chair X1', qty: 50, from: 'Supplier A', to: 'Zone B', time: '10 mins ago' },
                        { type: 'Outbound', item: 'Desk Lamp LED', qty: 12, from: 'Zone A', to: 'Dispatch', time: '25 mins ago' },
                        { type: 'Transfer', item: 'Leather Sofa', qty: 5, from: 'Zone C', to: 'Showroom', time: '1 hour ago' },
                    ].map((move, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/50 border border-beige-100 rounded-lg hover:border-brown-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${move.type === 'Inbound' ? 'bg-green-100 text-green-700' :
                                        move.type === 'Outbound' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {move.type === 'Inbound' ? <Truck className="w-4 h-4" /> :
                                        move.type === 'Outbound' ? <Package className="w-4 h-4" /> : <ArrowLeftRight className="w-4 h-4" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-brown-900">{move.item} <span className="text-xs font-normal text-brown-500">x{move.qty}</span></h4>
                                    <div className="flex items-center gap-2 text-xs text-brown-500 mt-1">
                                        <MapPin className="w-3 h-3" /> {move.from} <ArrowLeftRight className="w-3 h-3" /> {move.to}
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-brown-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {move.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MoveCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="glass-panel p-6 rounded-xl border border-beige-200 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-brown-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-brown-900">{value}</h3>
            <p className="text-brown-400 text-xs mt-2">{subtext}</p>
        </div>
        <div className={`p-3 rounded-lg bg-beige-100 text-brown-600`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

import { Clock } from 'lucide-react';

export default MovementDashboard;
