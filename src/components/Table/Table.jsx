import React from 'react';

const Table = ({ columns, data, actions }) => {
  return (
    <table className="min-w-full bg-white rounded shadow overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="text-left p-2">
              {col.label}
            </th>
          ))}
          {actions && actions.length > 0 && <th className="p-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr
            key={row.id || row.reservation_id || row.book_id || rowIdx}
            className="border-b"
          >
            {columns.map((col) => (
              <td key={`${row.id || row.reservation_id || row.book_id}-${col.key}`} className="p-2">
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
            {actions && actions.length > 0 && (
              <td className="p-2 flex gap-2">
                {actions.map((action) => (
                  <button
                    key={`${row.id || row.reservation_id || row.book_id}-${action.name}`}
                    onClick={() => action.onClick(row)}
                    disabled={action.disabled?.(row)}
                    className={`px-2 py-1 rounded ${
                      action.disabled?.(row)
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : action.className || 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {action.name}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
