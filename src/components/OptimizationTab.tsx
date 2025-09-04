import React, { useState } from 'react';
import { Play, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import clsx from 'clsx';
import { Parameters, OptimizationResults } from '../types';
import { MILPSolver } from '../utils/solver';
import { validateParameters, ValidationError } from '../utils/validation';

interface OptimizationTabProps {
  parameters: Parameters;
  appState: { E: number; K: number; T: number };
  onResultsChange: (results: OptimizationResults | null) => void;
}

export const OptimizationTab: React.FC<OptimizationTabProps> = ({
  parameters,
  appState,
  onResultsChange
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);

  const runOptimization = async () => {
    setIsRunning(true);
    setValidationErrors([]);

    try {
      // Validate parameters
      const errors = validateParameters(parameters, appState.E, appState.K, appState.T);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setIsRunning(false);
        return;
      }

      // Run optimization
      const solver = new MILPSolver(appState.E, appState.K, appState.T, parameters);
      
      // Simulate solving time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results = solver.solve();
      onResultsChange(results);
      setLastRunTime(new Date().toLocaleTimeString());
      
    } catch (error) {
      console.error('Optimization error:', error);
      setValidationErrors([{ field: 'general', message: 'Optimization failed. Please check your parameters.' }]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          MILP Optimization Engine
        </h2>
        <p className="text-slate-600 text-lg">
          Solve the mixed-integer linear programming model for optimal steel production under CCTS
        </p>
      </div>

      {/* Model Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-8 border border-blue-200">
        <h3 className="text-xl font-semibold mb-6 text-slate-800">Model Summary</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{appState.E}</div>
            <div className="text-slate-600">Steel Facilities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{appState.K}</div>
            <div className="text-slate-600">Production Technologies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{appState.T}</div>
            <div className="text-slate-600">Time Periods</div>
          </div>
        </div>
      </div>

      {/* Objective Function Display */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-700">Objective Function</h3>
        <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm">
          <div className="mb-2">Minimize:</div>
          <div className="space-y-1 text-slate-600 ml-4">
            <div>Σ<sub>i,t</sub> f<sub>i</sub> × oper<sub>i,t</sub> (fixed operating costs)</div>
            <div>+ Σ<sub>i,k,t</sub> c<sub>i,k</sub> × x<sub>i,k,t</sub> (variable production costs)</div>
            <div>+ Σ<sub>i,t</sub> p<sub>t</sub> × (buy<sub>i,t</sub> - sell<sub>i,t</sub>) (trading costs)</div>
            <div>+ Σ<sub>i,t</sub> h<sub>t</sub> × C<sub>i,t</sub> (carbon holding costs)</div>
            <div>+ Σ<sub>i,t</sub> π × unmet<sub>i,t</sub> (penalty costs)</div>
            <div>+ Σ<sub>i,k,τ</sub> ic<sub>i,k</sub> × build<sub>i,k,τ</sub> (investment costs)</div>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-red-800">Parameter Validation Errors</h4>
          </div>
          <ul className="space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                <span className="font-medium">{error.field}:</span> {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Run Button */}
      <div className="text-center">
        <button
          onClick={runOptimization}
          disabled={isRunning || validationErrors.length > 0}
          className={clsx(
            'inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200',
            {
              'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105': 
                !isRunning && validationErrors.length === 0,
              'bg-slate-400 text-slate-600 cursor-not-allowed': 
                isRunning || validationErrors.length > 0
            }
          )}
        >
          {isRunning ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              Running Optimization...
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              Run MILP Optimization
            </>
          )}
        </button>
      </div>

      {/* Last Run Info */}
      {lastRunTime && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Last optimized at {lastRunTime}</span>
          </div>
        </div>
      )}

      {/* Model Description */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 text-slate-700">Model Description</h3>
        <div className="prose prose-sm text-slate-600">
          <p>
            This MILP model optimizes steel production decisions across multiple facilities, technologies, 
            and time periods under India's Carbon Credit Trading Scheme (CCTS). The model considers:
          </p>
          <ul className="mt-3 space-y-1">
            <li>Production planning and technology investment decisions</li>
            <li>Carbon emissions trading and banking strategies</li>
            <li>Technology Performance Standards (TPS) compliance</li>
            <li>Resource constraints for scrap steel and CCUS capacity</li>
            <li>Operating budgets and demand fulfillment requirements</li>
          </ul>
        </div>
      </div>
    </div>
  );
};