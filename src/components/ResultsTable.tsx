import React from 'react';

interface ResultsTableProps {
  data: number[][] | number[][][];
  rowHeaders: string[];
  columnHeaders: string[];
  timeHeaders?: string[];
  type: '2d' | '3d';
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  data,
  rowHeaders,
  columnHeaders,
  timeHeaders,
  type
}) => {
  if (type === '2d') {
    const data2d = data as number[][];
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-300 px-3 py-2 text-left font-medium text-slate-600">
                Parameter
              </th>
              {columnHeaders.map((header, index) => (
                <th
                  key={index}
                  className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data2d.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50">
                <td className="border border-slate-300 px-3 py-2 font-medium text-slate-700 bg-slate-25">
                  {rowHeaders[rowIndex]}
                </td>
                {row.map((value, colIndex) => (
                  <td key={colIndex} className="border border-slate-300 px-3 py-2 text-center">
                    {value.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 3D table with time periods
  const data3d = data as number[][][];
  if (!timeHeaders) return null;

  return (
    <div className="space-y-6">
      {timeHeaders.map((timeHeader, timeIndex) => (
        <div key={timeIndex}>
          <h4 className="font-medium text-slate-700 mb-3">{timeHeader}</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-300 px-3 py-2 text-left font-medium text-slate-600">
                    Facility
                  </th>
                  {columnHeaders.map((header, index) => (
                    <th
                      key={index}
                      className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data3d.map((facilityData, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-50">
                    <td className="border border-slate-300 px-3 py-2 font-medium text-slate-700 bg-slate-25">
                      {rowHeaders[rowIndex]}
                    </td>
                    {facilityData[timeIndex] ? facilityData[timeIndex].map((value, colIndex) => (
                      <td key={colIndex} className="border border-slate-300 px-3 py-2 text-center">
                        {value.toFixed(2)}
                      </td>
                    )) : columnHeaders.map((_, colIndex) => (
                      <td key={colIndex} className="border border-slate-300 px-3 py-2 text-center">
                        {(data3d[rowIndex][colIndex] ? data3d[rowIndex][colIndex][timeIndex] : 0).toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};