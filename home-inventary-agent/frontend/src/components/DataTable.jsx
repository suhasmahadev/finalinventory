const DataTable = ({ columns, data, actions }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-emerald-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th 
                                    key={col.key} 
                                    className="bg-emerald-50/80 dark:bg-slate-900/50 border-b border-emerald-100 dark:border-slate-700 text-emerald-800 dark:text-emerald-400 uppercase text-xs font-bold py-4 px-6 tracking-wider transition-colors duration-300"
                                >
                                    {col.label}
                                </th>
                            ))}
                            {actions && (
                                <th className="bg-emerald-50/80 dark:bg-slate-900/50 border-b border-emerald-100 dark:border-slate-700 text-emerald-800 dark:text-emerald-400 uppercase text-xs font-bold py-4 px-6 tracking-wider transition-colors duration-300">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={columns.length + (actions ? 1 : 0)} 
                                    className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm transition-colors duration-300"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr key={index} className="border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-emerald-50/30 dark:hover:bg-slate-700/50 transition-colors duration-300">
                                    {columns.map((col) => (
                                        <td key={col.key} className="py-4 px-6 text-sm text-slate-700 dark:text-slate-200 font-medium transition-colors duration-300">
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="py-4 px-6">
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
        </div>
    );
};

export default DataTable;