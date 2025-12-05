import React from 'react';

const Table = ({ columns, data, actions }) => {
  // التأكد من أن data و actions عبارة عن مصفوفات
  const tableData = Array.isArray(data) ? data : [];
  const tableActions = Array.isArray(actions) ? actions : [];
  const showActions = tableActions.length > 0;

  return (
    <table className="min-w-full bg-white rounded shadow overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="text-left p-2">
              {col.label}
            </th>
          ))}
          {showActions && <th className="p-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, rowIdx) => (
          <tr
            key={row.id || row.reservation_id || row.book_id || rowIdx}
            className="border-b"
          >
            {columns.map((col) => (
              <td
                key={`${row.id || row.reservation_id || row.book_id}-${col.key}`}
                className="p-2"
              >
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}

            {showActions && (
              <td className="p-2 flex gap-2 items-center">
                {tableActions.map((action, actionIdx) => (
                  <button
                    key={`${row.id || row.reservation_id || row.book_id}-${actionIdx}`}
                    onClick={() => action.onClick(row)}
                    disabled={action.disabled?.(row)}
                    className={`flex items-center gap-1 transition ${
                      action.className ? action.className(row) : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {action.icon && <span className="text-base">{action.icon}</span>}
                    {action.label || action.name}
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

