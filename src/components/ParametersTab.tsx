import React from 'react';
import { Shuffle, Plus, Minus } from 'lucide-react';
import { Parameters } from '../types';
import { ParameterTable } from './ParameterTable';
import { randomizeFirmAttributes } from '../data/defaults';

interface ParametersTabProps {
  parameters: Parameters;
  appState: { E: number; K: number; T: number; mode: 'single' | 'multi'; randomSeed: number };
  onParameterChange: (newParams: Parameters) => void;
  onReset: () => void;
}

export const ParametersTab: React.FC<ParametersTabProps> = ({
  parameters,
  appState,
  onParameterChange,
  onReset
}) => {
  const { E, K, T, mode } = appState;

  const updateTechnology = (techId: number, field: keyof Technology, value: string | number) => {
    const newParams = { ...parameters };
    const techIndex = newParams.technologies.findIndex(t => t.id === techId);
    if (techIndex !== -1) {
      newParams.technologies = [...newParams.technologies];
      newParams.technologies[techIndex] = {
        ...newParams.technologies[techIndex],
        [field]: value
      };
      onParameterChange(newParams);
    }
  };

  const addTechnology = () => {
    const newParams = { ...parameters };
    const newTechId = Math.max(...parameters.technologies.map(t => t.id)) + 1;
    
    newParams.technologies = [...parameters.technologies, {
      id: newTechId,
      name: `Technology ${newTechId}`,
      variableCost: 70,
      emissionsIntensity: 1.5,
      capacityPerUnit: 1000,
      gestationPeriod: 2,
      investmentCost: 15000,
      earliestBuild: 2,
      scrapUse: 0.3,
      ccusUse: 0.3
    }];
    
    onParameterChange(newParams);
  };

  const removeTechnology = (techId: number) => {
    if (parameters.technologies.length <= 2) return; // Minimum 2 technologies
    
    const newParams = { ...parameters };
    newParams.technologies = parameters.technologies.filter(t => t.id !== techId);
    onParameterChange(newParams);
  };

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
      case 'baselineIntensity':
        newParams.baselineIntensity = [...parameters.baselineIntensity];
        newParams.baselineIntensity[indices[0]] = value;
        break;
      case 'targetIntensity':
        newParams.targetIntensity = [...parameters.targetIntensity];
        newParams.targetIntensity[indices[0]] = value;
        break;
      case 'investCap':
        newParams.investCap = [...parameters.investCap];
        newParams.investCap[indices[0]] = value;
        break;
    }
    
    onParameterChange(newParams);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Model Parameters {mode === 'single' ? '(Single Facility)' : '(Multi-Facility)'}
        </h2>
        <button
          onClick={onReset}
          className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="grid gap-8">
        {/* Firm-specific attributes */}
        {mode === 'multi' && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Firm Attributes</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-300 px-3 py-2 text-left font-medium text-slate-600">Facility</th>
                    <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">Strategic Orientation</th>
                    <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">Investment Capital ($)</th>
                    <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">Baseline Intensity (tCO2/unit)</th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.firmAttributes.map((attr, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="border border-slate-300 px-3 py-2 font-medium text-slate-700">
                        Facility {i + 1}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          attr.strategicOrientation === 'green-leader' ? 'bg-green-100 text-green-800' :
                          attr.strategicOrientation === 'cost-minimizer' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {attr.strategicOrientation.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-center">
                        {attr.investibleCapital.toLocaleString()}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-center">
                        {attr.baselineIntensity.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Technology Database */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-700">Technology Database</h3>
            <div className="flex gap-2">
              <button
                onClick={addTechnology}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Tech
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-300 px-3 py-2 text-left font-medium text-slate-600">Technology</th>
                  <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">Variable Cost ($/unit)</th>
                  <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">Emissions (tCO2/unit)</th>
                  <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">Capacity (units/period)</th>
                  <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">Gestation (periods)</th>
                  <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">Investment ($/unit)</th>
                  <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">Earliest Build</th>
                  <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">Scrap Use</th>
                  <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">CCUS Use</th>
                  <th className="border border-slate-300 px-3 py-2 text-center font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parameters.technologies.map((tech) => (
                  <tr key={tech.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 px-3 py-2 font-medium text-slate-700">
                      <input
                        type="text"
                        value={tech.name}
                        onChange={(e) => updateTechnology(tech.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 text-sm border-none bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center">
                      <input
                        type="number"
                        step="0.01"
                        value={tech.variableCost}
                        onChange={(e) => updateTechnology(tech.id, 'variableCost', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-center text-sm border-none bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center">
                      <input
                        type="number"
                        step="0.01"
                        value={tech.emissionsIntensity}
                        onChange={(e) => updateTechnology(tech.id, 'emissionsIntensity', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-center text-sm border-none bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center">
                      <input
                        type="number"
                        step="1"
                        value={tech.capacityPerUnit}
                        onChange={(e) => updateTechnology(tech.id, 'capacityPerUnit', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-center text-sm border-none bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center">
                      <input
                        type="number"
                        step="1"
                        min="1"
                        value={tech.gestationPeriod}
                        onChange={(e) => updateTechnology(tech.id, 'gestationPeriod', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 text-center text-sm border-none bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center">
                      <input
                        type="number"
                        step="100"
                        value={tech.investmentCost}
                        onChange={(e) => updateTechnology(tech.id, 'investmentCost', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-center text-sm border-none bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center">
                      <input
                        type="number"
                        step="1"
                        min="1"
                        value={tech.earliestBuild}
                        onChange={(e) => updateTechnology(tech.id, 'earliestBuild', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 text-center text-sm border-none bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={tech.scrapUse}
                        onChange={(e) => updateTechnology(tech.id, 'scrapUse', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-center text-sm border-none bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={tech.ccusUse}
                        onChange={(e) => updateTechnology(tech.id, 'ccusUse', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-center text-sm border-none bg-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded"
                      />
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center">
                      {parameters.technologies.length > 2 && (
                        <button
                          onClick={() => removeTechnology(tech.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Facility-level parameters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Fixed Operating Costs ($/period)</h3>
          <ParameterTable
            data={parameters.fi.map(val => [val])}
            rowHeaders={mode === 'single' ? ['Facility'] : Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
            columnHeaders={['Cost']}
            onCellChange={(row, col, value) => handleParameterUpdate('fi', [row], value)}
          />
        </div>

        {/* New baseline and target intensity parameters */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Baseline Intensity (tCO2/unit)</h3>
            <ParameterTable
              data={parameters.baselineIntensity.map(val => [val])}
              rowHeaders={mode === 'single' ? ['Facility'] : Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={['Baseline']}
              onCellChange={(row, col, value) => handleParameterUpdate('baselineIntensity', [row], value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Target Intensity (tCO2/unit)</h3>
            <ParameterTable
              data={parameters.targetIntensity.map(val => [val])}
              rowHeaders={Array.from({ length: T }, (_, t) => `Period ${t + 1}`)}
              columnHeaders={['Target']}
              onCellChange={(row, col, value) => handleParameterUpdate('targetIntensity', [row], value)}
            />
          </div>
        </div>

        {/* Investment capital constraints */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Investment Capital Constraints ($)</h3>
          <ParameterTable
            data={parameters.investCap.map(val => [val])}
            rowHeaders={mode === 'single' ? ['Facility'] : Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
            columnHeaders={['Capital']}
            onCellChange={(row, col, value) => handleParameterUpdate('investCap', [row], value)}
          />
        </div>

        {/* Technology-dependent parameters */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Variable Costs ($/unit)</h3>
            <ParameterTable
              data={parameters.ci}
              rowHeaders={mode === 'single' ? ['Facility'] : Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={Array.from({ length: K }, (_, k) => `Tech ${k + 1}`)}
              onCellChange={(row, col, value) => handleParameterUpdate('ci', [row, col], value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Emissions Intensity (tCO2/unit)</h3>
            <ParameterTable
              data={parameters.ei}
              rowHeaders={mode === 'single' ? ['Facility'] : Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={Array.from({ length: K }, (_, k) => `Tech ${k + 1}`)}
              onCellChange={(row, col, value) => handleParameterUpdate('ei', [row, col], value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Capacity per Unit (units/period)</h3>
            <ParameterTable
              data={parameters.wi}
              rowHeaders={mode === 'single' ? ['Facility'] : Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={Array.from({ length: K }, (_, k) => `Tech ${k + 1}`)}
              onCellChange={(row, col, value) => handleParameterUpdate('wi', [row, col], value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Investment Costs ($/unit)</h3>
            <ParameterTable
              data={parameters.ici}
              rowHeaders={mode === 'single' ? ['Facility'] : Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
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
              rowHeaders={mode === 'single' ? ['Facility'] : Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={Array.from({ length: T }, (_, t) => `Period ${t + 1}`)}
              onCellChange={(row, col, value) => handleParameterUpdate('di', [row, col], value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Carbon Prices ($/credit)</h3>
            <ParameterTable
              data={parameters.pt}
              rowHeaders={mode === 'single' ? ['Facility'] : Array.from({ length: E }, (_, i) => `Facility ${i + 1}`)}
              columnHeaders={Array.from({ length: T }, (_, t) => `Period ${t + 1}`)}
              onCellChange={(row, col, value) => handleParameterUpdate('pt', [row, col], value)}
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
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Holding Costs ($/tCO2)</h3>
            <ParameterTable
              data={parameters.ht.map(val => [val])}
              rowHeaders={Array.from({ length: T }, (_, t) => `Period ${t + 1}`)}
              columnHeaders={['Cost']}
              onCellChange={(row, col, value) => handleParameterUpdate('ht', [row], value)}
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
