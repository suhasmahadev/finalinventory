import { useEffect, useState } from 'react';
import * as analyticsApi from '../api/analyticsApi';
import DataTable from '../components/DataTable';

const Analytics = () => {
    const [leastSelling, setLeastSelling] = useState([]);

    useEffect(() => {
        analyticsApi.getLeastSelling().then(setLeastSelling).catch(console.error);
    }, []);

    return (
        <div className="flex-col gap-4">
            <h1 className="text-lg font-bold">Analytics Reports</h1>

            <div className="card">
                <h3 className="mb-4 font-bold text-secondary">Least Selling Items</h3>
                <DataTable
                    columns={[{ key: 'name', label: 'Item' }, { key: 'total_sold', label: 'Sold Count' }]}
                    data={leastSelling}
                />
            </div>
        </div>
    );
};

export default Analytics;
