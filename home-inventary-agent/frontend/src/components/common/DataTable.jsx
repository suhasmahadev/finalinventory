import React from 'react';
import './DataTable.css';

const DataTable = ({ data, columns, onRowClick }) => {
    if (!data || data.length === 0) {
        return <div className="no-data">No data available</div>;
    }

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={onRowClick ? 'clickable' : ''}
                        >
                            {columns.map((column) => (
                                <td key={column.key}>
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
