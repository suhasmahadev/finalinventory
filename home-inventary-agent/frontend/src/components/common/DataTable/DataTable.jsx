import React from 'react';


const DataTable = ({ data, columns, onRowClick }) => {
    if (!data || data.length === 0) {
        return (
            <div className="p-8 text-center text-brown-400 italic bg-white/50 rounded-xl border border-beige-200">
                No data available
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-beige-200 shadow-sm">
            <table className="w-full border-collapse bg-white text-left">
                <thead className="bg-beige-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="p-4 text-xs font-semibold uppercase tracking-wider text-brown-500 border-b border-beige-200"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-beige-100">
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`
                                transition-colors duration-150
                                ${onRowClick
                                    ? 'cursor-pointer hover:bg-beige-50'
                                    : ''}
                            `}
                        >
                            {columns.map((column) => (
                                <td key={column.key} className="p-4 text-sm text-brown-700 whitespace-nowrap">
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
