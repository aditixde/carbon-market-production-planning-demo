import React from 'react';
import { clsx } from 'clsx';

interface ParameterTableProps {
  data: number[][];
  rowHeaders: string[];
  columnHeaders: string[];
  onCellChange: (row: number, col: number, value: number) => void;
  className?: string;
}

export const ParameterTable: React.FC<ParameterTableProps> = ({
  data,
  rowHeaders,
  columnHeaders,
  onCellChange,
  className
}) => {
  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50">
            <th className="border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-600">
              Parameter
            </th>
            {columnHeaders.map((header, index) => (
              <th
                key={index}
                className="border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-600"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
              <td className="border border-slate-300 px-3 py-2 font-medium text-sm text-slate-700 bg-slate-25">
                {rowHeaders[rowIndex]}
              </td>
              {row.map((value, colIndex) => (
                <td key={colIndex} className="border border-slate-300 px-1 py-1">
                  <input
                    type="number"
                    step="any"
                    value={value}
                    onChange={(e) => onCellChange(rowIndex, colIndex, parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-center text-sm border-none bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};