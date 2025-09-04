import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TabNavigation } from './components/TabNavigation';
import { ParametersTab } from './components/ParametersTab';
import { OptimizationTab } from './components/OptimizationTab';
import { ResultsTab } from './components/ResultsTab';
import { createDefaultParameters } from './data/defaults';
import { AppState, Parameters, OptimizationResults } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>({ E: 2, K: 3, T: 4 });
  const [parameters, setParameters] = useState<Parameters>(
    createDefaultParameters(2, 3, 4)
  );
  const [activeTab, setActiveTab] = useState('parameters');
  const [results, setResults] = useState<OptimizationResults | null>(null);

  // Update parameters when app state changes
  useEffect(() => {
    setParameters(createDefaultParameters(appState.E, appState.K, appState.T));
    setResults(null); // Clear previous results
  }, [appState.E, appState.K, appState.T]);

  const handleReset = () => {
    setParameters(createDefaultParameters(appState.E, appState.K, appState.T));
    setResults(null);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'parameters':
        return (
          <ParametersTab
            parameters={parameters}
            appState={appState}
            onParameterChange={setParameters}
            onReset={handleReset}
          />
        );
      case 'optimization':
        return (
          <OptimizationTab
            parameters={parameters}
            appState={appState}
            onResultsChange={setResults}
          />
        );
      case 'results':
        return (
          <ResultsTab
            results={results}
            appState={appState}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        appState={appState}
        onStateChange={setAppState}
        onReset={handleReset}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Steel Production Carbon Optimization Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                India's Carbon Credit Trading Scheme (CCTS) for Steel Sector
              </p>
            </div>
            <div className="text-right text-sm text-slate-500">
              <div>Model: {appState.E}F × {appState.K}T × {appState.T}P</div>
              <div className="text-xs">Facilities × Technologies × Periods</div>
            </div>
          </div>
        </header>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderActiveTab()}
          </div>
        </main>

        <footer className="bg-white border-t border-slate-200 px-6 py-4">
          <div className="flex justify-between items-center text-sm text-slate-600">
            <div>
              <a 
                href="https://github.com/aditixde/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                GitHub Repository
              </a>
            </div>
            <div>
              <span>Indian Institute of Technology, Roorkee</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;