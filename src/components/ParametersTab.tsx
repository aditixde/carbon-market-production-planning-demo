import React from 'react';
import { Parameters } from '../types';
import { ParameterTable } from './ParameterTable';

interface ParametersTabProps {
  parameters: Parameters;
  appState: { E: number; K: number; T: number };
  onParameterChange: (newParams: Parameters) => void;
  onReset: () => void;
}

export const ParametersTab: React.FC<ParametersTabProps> = ({
  parameters,
  appState,
  onParameterChange,
  onReset
}) => {
  const { E, K, T } = appState;

  const handleParameterUpdate = (category: string, indices: number[], value: number) => {
    const newParams = { ...parameters };
    
    switch (category) {
      case 'fi':
        newParams.fi = [...parameters.fi];
        newParams.fi[indices[0]] = value;
        break;
      case 'ci':
        newParams.ci = parameters.ci.map(row => [...row]);
        newParams.ci[indices[0]][indices[1]] = value;
        break;
      case 'ei':
        newParams.ei = parameters.ei.map(row => [...row]);
        newParams.ei[indices[0]][indices[1]] = value;
        break;
      case 'wi':
        newParams.wi = parameters.wi.map(row => [...row]);
        newParams.wi[indices[0]][indices[1]] = value;
        break;
      case 'yi':
        newParams.yi = parameters.yi.map(row => [...row]);
        newParams.yi[indices[0]][indices[1]] = value;
        break;
      case 'ici':
        newParams.ici = parameters.ici.map(row => [...row]);
        newParams.ici[indices[0]][indices[1]] = value;
        break;
      case 'ai':
        newParams.ai = parameters.ai.map(row => [...row]);
        newParams.ai[indices[0]][indices[1]] = value;
        break;
      case 'di':
        newParams.di = parameters.di.map(row => [...row]);
        newParams.di[indices[0]][indices[1]] = value;
        break;
      case 'beta':
        newParams.beta = [...parameters.beta];
        newParams.beta[indices[0]] = value;
        break;
      case 'pt':
        newParams.pt = [...parameters.pt];
        newParams.pt[indices[0]] = value;
        break;
      case 'Ai':
        newParams.Ai = parameters.Ai.map(row => [...row]);
        newParams.Ai[indices[0]][indices[1]] = value;
        break;
      case 'ht':
        newParams.ht = [...parameters.ht];
        newParams.ht[indices[0]] = value;
        break;
      case 'oi':
        newParams.oi = parameters.oi.map(row => [...row]);
        newParams.oi[indices[0]][indices[1]] = value;
        break;
      case 'bi':
        newParams.bi = parameters.bi.map(row => [...row]);
        newParams.bi[indices[0]][indices[1]] = value;
        break;
      case 'si':
        newParams.si = parameters.si.map(row => [...row]);
        newParams.si[indices[0]][indices[1]] = value;
        break;
      case 'scrapUse':
        newParams.scrapUse = parameters.scrapUse.map(row => [...row]);
        newParams.scrapUse[indices[0]][indices[1]] = value;
        break;
      case 'ccusUse':
        newParams.ccusUse = parameters.ccusUse.map(row => [...row]);
        newParams.ccusUse[indices[0]][indices[1]] = value;
        break;
      case 'St':
        newParams.St = [...parameters.St];
        newParams.St[indices[0]] = value;
        break;
      case 'Ut':
        newParams.Ut = [...parameters.Ut];
        newParams.Ut[indices[0]] = value;
        break;
      case 'pi':
        newParams.pi = value;
        break;
      case 'M':
        newParams.M = value;
        break;
    }
    
    onParameterChange(newParams);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Model Parameters</h2>
        <button
          onClick={onReset}
          className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="grid gap-8">
        {/* Facility-level parameters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Fixed Operating Costs ($/period)</h3>
          <ParameterTable
            data={parameters.fi.map(val => [val])}
            rowHeaders={Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
            columnHeaders={['Cost']}
            onCellChange={(row, col, value) => handleParameterUpdate('fi', [row], value)}
          />
        </div>

        {/* Technology-dependent parameters */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Variable Costs ($/unit)</h3>
            <ParameterTable
              data={parameters.ci}
              rowHeaders={Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={Array.from({ length: K }, (_, k) => `Tech ${k + 1}`)}
              onCellChange={(row, col, value) => handleParameterUpdate('ci', [row, col], value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Emissions Intensity (tCO2/unit)</h3>
            <ParameterTable
              data={parameters.ei}
              rowHeaders={Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={Array.from({ length: K }, (_, k) => `Tech ${k + 1}`)}
              onCellChange={(row, col, value) => handleParameterUpdate('ei', [row, col], value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Capacity per Unit (units/period)</h3>
            <ParameterTable
              data={parameters.wi}
              rowHeaders={Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={Array.from({ length: K }, (_, k) => `Tech ${k + 1}`)}
              onCellChange={(row, col, value) => handleParameterUpdate('wi', [row, col], value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Investment Costs ($/unit)</h3>
            <ParameterTable
              data={parameters.ici}
              rowHeaders={Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={Array.from({ length: K }, (_, k) => `Tech ${k + 1}`)}
              onCellChange={(row, col, value) => handleParameterUpdate('ici', [row, col], value)}
            />
          </div>
        </div>

        {/* Time-dependent parameters */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Demand (units)</h3>
            <ParameterTable
              data={parameters.di}
              rowHeaders={Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={Array.from({ length: T }, (_, t) => `Period ${t + 1}`)}
              onCellChange={(row, col, value) => handleParameterUpdate('di', [row, col], value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Free Allocations (tCO2)</h3>
            <ParameterTable
              data={parameters.Ai}
              rowHeaders={Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={Array.from({ length: T }, (_, t) => `Period ${t + 1}`)}
              onCellChange={(row, col, value) => handleParameterUpdate('Ai', [row, col], value)}
            />
          </div>
        </div>

        {/* System-wide parameters */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Benchmark Emissions (tCO2/unit)</h3>
            <ParameterTable
              data={parameters.beta.map(val => [val])}
              rowHeaders={Array.from({ length: T }, (_, t) => `Period ${t + 1}`)}
              columnHeaders={['Benchmark']}
              onCellChange={(row, col, value) => handleParameterUpdate('beta', [row], value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Carbon Prices ($/credit)</h3>
            <ParameterTable
              data={parameters.pt.map(val => [val])}
              rowHeaders={Array.from({ length: T }, (_, t) => `Period ${t + 1}`)}
              columnHeaders={['Price']}
              onCellChange={(row, col, value) => handleParameterUpdate('pt', [row], value)}
            />
          </div>
        </div>

        {/* Global parameters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Global Parameters</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Penalty (π) - $/unit</label>
              <input
                type="number"
                value={parameters.pi}
                onChange={(e) => handleParameterUpdate('pi', [], parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Big-M Parameter</label>
              <input
                type="number"
                value={parameters.M}
                onChange={(e) => handleParameterUpdate('M', [], parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};