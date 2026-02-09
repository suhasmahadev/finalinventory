const DataTable = ({ columns, data, actions }) => {
    return (
        <div className="card data-table-container" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                        {actions && th_actions()}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col) => (
                                    <td key={col.key}>
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td>
                                        <div className="flex gap-2">
                                            {actions(row)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

function th_actions() {
    return <th>Actions</th>
}

export default DataTable;
