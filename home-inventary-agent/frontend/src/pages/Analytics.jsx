import { useEffect, useState } from 'react';
import * as analyticsApi from '../api/analyticsApi';
import * as inventoryApi from '../api/inventoryApi';
import DataTable from '../components/DataTable';

const Analytics = () => {
    const [soldToday, setSoldToday] = useState(0);
    const [revenueToday, setRevenueToday] = useState(0);
    const [topSelling, setTopSelling] = useState([]);
    const [leastSelling, setLeastSelling] = useState([]);
    const [expiring, setExpiring] = useState([]);
    const [deadStock, setDeadStock] = useState([]);
    const [stockSummary, setStockSummary] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [forecast, setForecast] = useState(null);
    const [reorderSuggestion, setReorderSuggestion] = useState(null);
    const [salesHistory, setSalesHistory] = useState(null);
    const [turnover, setTurnover] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
        fetchItems();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const [sold, revenue, top, least, exp, dead, summary] = await Promise.all([
                analyticsApi.getSoldToday(),
                analyticsApi.getRevenueToday(),
                analyticsApi.getTopSelling(5),
                analyticsApi.getLeastSelling(5),
                analyticsApi.getExpiringItems(7),
                analyticsApi.getDeadStock(30),
                analyticsApi.getStockSummary()
            ]);
            setSoldToday(sold);
            setRevenueToday(revenue);
            setTopSelling(top);
            setLeastSelling(least);
            setExpiring(exp);
            setDeadStock(dead);
            setStockSummary(summary);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const fetchItems = async () => {
        try {
            const data = await inventoryApi.getItems();
            setItems(data);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchItemAnalytics = async () => {
        if (!selectedItem) return;
        try {
            const [forecastData, reorder, history, turnoverData] = await Promise.all([
                analyticsApi.getForecast(selectedItem, 7),
                analyticsApi.getReorderSuggestion(selectedItem, 7),
                analyticsApi.getSalesHistory(selectedItem, 30),
                analyticsApi.getStockTurnover(selectedItem, 30)
            ]);
            setForecast(forecastData);
            setReorderSuggestion(reorder);
            setSalesHistory(history);
            setTurnover(turnoverData);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex-col gap-4">
                <h1 className="text-lg font-bold">Analytics</h1>
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="flex-col gap-4">
            <h1 className="text-lg font-bold">Analytics Dashboard</h1>

            {error && (
                <div style={{ padding: '1rem', background: 'var(--danger-color)', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            <div className="flex gap-4">
                <div className="card flex-1">
                    <h3 className="text-secondary text-sm">Sold Today</h3>
                    <div className="text-lg font-bold" style={{ fontSize: '2rem' }}>{soldToday}</div>
                </div>
                <div className="card flex-1">
                    <h3 className="text-secondary text-sm">Revenue Today</h3>
                    <div className="text-lg font-bold" style={{ fontSize: '2rem' }}>${revenueToday.toFixed(2)}</div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="card flex-1">
                    <h3 className="mb-4 font-bold text-secondary">Top Selling Items</h3>
                    <DataTable
                        columns={[
                            { key: 'name', label: 'Item' },
                            { key: 'sku', label: 'SKU' },
                            { key: 'total_sold', label: 'Sold' }
                        ]}
                        data={topSelling}
                    />
                </div>
                <div className="card flex-1">
                    <h3 className="mb-4 font-bold text-secondary">Least Selling Items</h3>
                    <DataTable
                        columns={[
                            { key: 'name', label: 'Item' },
                            { key: 'sku', label: 'SKU' },
                            { key: 'total_sold', label: 'Sold' }
                        ]}
                        data={leastSelling}
                    />
                </div>
            </div>

            <div className="card">
                <h3 className="mb-4 font-bold text-secondary">Expiring Items (Next 7 Days)</h3>
                <DataTable
                    columns={[
                        { key: 'item_name', label: 'Item' },
                        { key: 'sku', label: 'SKU' },
                        { key: 'expiry_date', label: 'Expiry Date' },
                        { key: 'quantity_available', label: 'Quantity' }
                    ]}
                    data={expiring}
                />
            </div>

            <div className="card">
                <h3 className="mb-4 font-bold text-secondary">Dead Stock (No Movement in 30 Days)</h3>
                <DataTable
                    columns={[
                        { key: 'item_name', label: 'Item' },
                        { key: 'sku', label: 'SKU' }
                    ]}
                    data={deadStock}
                />
            </div>

            <div className="card">
                <h3 className="mb-4 font-bold text-secondary">Stock Summary</h3>
                <DataTable
                    columns={[
                        { key: 'item_name', label: 'Item' },
                        { key: 'sku', label: 'SKU' },
                        { key: 'total_stock', label: 'Total Stock' }
                    ]}
                    data={stockSummary}
                />
            </div>

            <div className="card">
                <h3 className="mb-4 font-bold text-secondary">Item-Specific Analytics</h3>
                <div className="flex gap-2 mb-4">
                    <select
                        className="input"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                    >
                        <option value="">Select Item</option>
                        {items.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    <button className="btn btn-primary" onClick={fetchItemAnalytics}>
                        Analyze
                    </button>
                </div>

                {forecast && (
                    <div className="mb-4">
                        <h4 className="font-bold mb-2">Forecast (7 Days)</h4>
                        <p>Predicted Demand: {forecast.predicted_demand}</p>
                        <p>Confidence: {(forecast.confidence * 100).toFixed(1)}%</p>
                    </div>
                )}

                {reorderSuggestion && (
                    <div className="mb-4">
                        <h4 className="font-bold mb-2">Reorder Suggestion</h4>
                        <p>Current Stock: {reorderSuggestion.current_stock}</p>
                        <p>Predicted Demand: {reorderSuggestion.predicted_demand}</p>
                        <p>Suggested Order: {reorderSuggestion.suggested_order_quantity}</p>
                        <p>Should Reorder: {reorderSuggestion.should_reorder ? 'Yes' : 'No'}</p>
                    </div>
                )}

                {turnover && (
                    <div className="mb-4">
                        <h4 className="font-bold mb-2">Stock Turnover (30 Days)</h4>
                        <p>Total Sold: {turnover.total_sold}</p>
                        <p>Current Stock: {turnover.current_stock}</p>
                        <p>Turnover Ratio: {turnover.turnover_ratio}</p>
                    </div>
                )}

                {salesHistory && salesHistory.data && (
                    <div>
                        <h4 className="font-bold mb-2">Sales History (30 Days)</h4>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {salesHistory.data.map((entry, idx) => (
                                <div key={idx} className="text-sm">
                                    {entry.date}: {entry.qty_sold} units
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
