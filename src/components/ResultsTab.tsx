import React from 'react';
import { Download, TrendingUp, Factory, Zap } from 'lucide-react';
import { OptimizationResults } from '../types';
import { ResultsCharts } from './ResultsCharts';
import { ResultsTable } from './ResultsTable';

interface ResultsTabProps {
  results: OptimizationResults | null;
  appState: { E: number; K: number; T: number };
}

export const ResultsTab: React.FC<ResultsTabProps> = ({ results, appState }) => {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No Results Available</h3>
        <p>Run the optimization to see results here</p>
      </div>
    );
  }

  if (results.status !== 'optimal') {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-500">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-2">Optimization Failed</h3>
        <p>The model could not find an optimal solution. Please check your parameters.</p>
      </div>
    );
  }

  const exportResults = () => {
    const csvData = generateCSV(results, appState);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `steel-optimization-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header with key metrics */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Optimization Results</h2>
            <p className="text-slate-600">Optimal solution found successfully</p>
          </div>
          <button
            onClick={exportResults}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              ${results.objective.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Total Cost</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3">
              <Factory className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600 mb-1">
              {results.metrics.totalEmissions.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Total Emissions (tCO2)</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {results.metrics.totalUnmet.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Unmet Demand (units)</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {((results.metrics.totalEmissions / results.variables.output.flat().reduce((a, b) => a + b, 0)) || 0).toFixed(2)}
            </div>
            <div className="text-sm text-slate-600">Avg. Intensity (tCO2/unit)</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <ResultsCharts results={results} appState={appState} />

      {/* Detailed Results Tables */}
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Production Schedule (units)</h3>
          <ResultsTable
            data={results.variables.production}
            rowHeaders={Array.from({ length: appState.E }, (_, i) => `Facility ${i + 1}`)}
            columnHeaders={Array.from({ length: appState.K }, (_, k) => `Tech ${k + 1}`)}
            timeHeaders={Array.from({ length: appState.T }, (_, t) => `Period ${t + 1}`)}
            type="3d"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Carbon Trading (tCO2)</h3>
            <ResultsTable
              data={results.variables.buy.map((row, i) => 
                row.map((buy, t) => [buy, results.variables.sell[i][t]])
              )}
              rowHeaders={Array.from({ length: appState.E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={['Buy', 'Sell']}
              timeHeaders={Array.from({ length: appState.T }, (_, t) => `Period ${t + 1}`)}
              type="3d"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Emissions vs Output</h3>
            <ResultsTable
              data={results.variables.emissions.map((row, i) => 
                row.map((emis, t) => [emis, results.variables.output[i][t]])
              )}
              rowHeaders={Array.from({ length: appState.E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={['Emissions', 'Output']}
              timeHeaders={Array.from({ length: appState.T }, (_, t) => `Period ${t + 1}`)}
              type="3d"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function generateCSV(results: OptimizationResults, appState: { E: number; K: number; T: number }): string {
  let csv = 'Steel Production Optimization Results\n\n';
  csv += `Objective Value:,${results.objective}\n`;
  csv += `Status:,${results.status}\n\n`;

  // Production data
  csv += 'Production Schedule (units)\n';
  csv += 'Facility,Technology,';
  for (let t = 0; t < appState.T; t++) {
    csv += `Period ${t + 1}${t < appState.T - 1 ? ',' : '\n'}`;
  }

  for (let i = 0; i < appState.E; i++) {
    for (let k = 0; k < appState.K; k++) {
      csv += `Facility ${i + 1},Tech ${k + 1},`;
      for (let t = 0; t < appState.T; t++) {
        csv += `${results.variables.production[i][k][t]}${t < appState.T - 1 ? ',' : '\n'}`;
      }
    }
  }

  return csv;
}