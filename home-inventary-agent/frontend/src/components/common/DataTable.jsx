const DataTable = ({ data, columns, onRowClick }) => {
    if (!data || data.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500 dark:text-navy-400 italic bg-white dark:bg-navy-800/50 rounded-xl border border-slate-200 dark:border-navy-700">
                No data available
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-navy-700 shadow-sm">
            <table className="w-full border-collapse bg-white dark:bg-navy-800/50 text-left">
                <thead className="bg-slate-50 dark:bg-navy-900/50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-navy-300 border-b border-slate-200 dark:border-navy-700"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-navy-700">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`
                                transition-colors duration-150
                                ${onRowClick
                                    ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-700/50'
                                    : ''}
                            `}
                        >
                            {columns.map((column) => (
                                <td key={column.key} className="p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                    {column.render
                                        ? column.render(row[column.key], row)
                                        : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
