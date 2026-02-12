import { useEffect, useState } from 'react';
import * as analyticsApi from '../api/analyticsApi';

const Dashboard = () => {
    const [soldToday, setSoldToday] = useState(0);
    const [revenueToday, setRevenueToday] = useState(0);
    const [topItems, setTopItems] = useState([]);
    const [expiring, setExpiring] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [sold, revenue, top, exp] = await Promise.all([
                    analyticsApi.getSoldToday(),
                    analyticsApi.getRevenueToday(),
                    analyticsApi.getTopSelling(5),
                    analyticsApi.getExpiringItems(7)
                ]);

                setSoldToday(sold);
                setRevenueToday(revenue);
                setTopItems(top);
                setExpiring(exp);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
                setError(err.message || "Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex-col gap-4">
                <h1 className="text-lg font-bold">Dashboard</h1>
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="flex-col gap-4">
            <h1 className="text-lg font-bold">Dashboard</h1>

            {error && (
                <div style={{ padding: '1rem', background: 'var(--danger-color)', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <div className="card flex-1">
                    <h3 className="text-secondary text-sm">Items Sold Today</h3>
                    <div className="text-lg font-bold" style={{ fontSize: '2rem' }}>{soldToday}</div>
                </div>
                <div className="card flex-1">
                    <h3 className="text-secondary text-sm">Revenue Today</h3>
                    <div className="text-lg font-bold" style={{ fontSize: '2rem' }}>${revenueToday.toFixed(2)}</div>
                </div>
                <div className="card flex-1">
                    <h3 className="text-secondary text-sm">Expiring Soon</h3>
                    <div className="text-lg font-bold" style={{ fontSize: '2rem', color: 'var(--danger-color)' }}>
                        {expiring.length}
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="card flex-1">
                    <h3 className="text-lg font-bold mb-4">Top Selling Items</h3>
                    <ul>
                        {topItems.map((item, i) => (
                            <li key={i} className="flex justify-between py-2 border-b border-gray-700">
                                <span>{item.name || `Item ${item.item_id}`}</span>
                                <span className="font-bold">{item.total_sold}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card flex-1">
                    <h3 className="text-lg font-bold mb-4">Expiring This Week</h3>
                    <ul>
                        {expiring.map((item, i) => (
                            <li key={i} className="flex justify-between py-2 border-b border-gray-700">
                                <span>{item.item_name}</span>
                                <span className="text-sm text-secondary">{item.expiry_date}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
