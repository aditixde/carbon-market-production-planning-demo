import React from 'react';
import { Settings, Factory, Cpu, Clock, User, Users } from 'lucide-react';
import { AppState } from '../types';

interface SidebarProps {
  appState: AppState;
  onStateChange: (newState: AppState) => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ appState, onStateChange, onReset }) => {
  const handleModeChange = (mode: 'single' | 'multi') => {
    const newState = { 
      ...appState, 
      mode,
      E: mode === 'single' ? 1 : Math.max(2, appState.E)
    };
    onStateChange(newState);
  };

  return (
    <div className="w-80 bg-slate-900 text-white p-6 shadow-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Factory className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold">Steel CCTS Optimizer</h1>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          Carbon Credit Trading Scheme optimization for steel production facilities
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Operating Mode</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => handleModeChange('single')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                appState.mode === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <User className="w-4 h-4" />
              Single
            </button>
            <button
              onClick={() => handleModeChange('multi')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                appState.mode === 'multi'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Users className="w-4 h-4" />
              Multi
            </button>
          </div>
          
          <p className="text-xs text-slate-400">
            {appState.mode === 'single' 
              ? 'Single facility manager view' 
              : 'Multi-facility market simulation'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Model Configuration</h2>
          </div>
          
          <div className="space-y-6">
            {appState.mode === 'multi' && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Factory className="w-4 h-4" />
                  Facilities (E): {appState.E}
                </label>
                <input
                  type="range"
                  min="2"
                  max="800"
                  value={appState.E}
                  onChange={(e) => onStateChange({ ...appState, E: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>2</span>
                  <span>800</span>
                </div>
                {appState.E > 100 && (
                  <p className="text-xs text-yellow-400 mt-1">
                    ⚠️ Large models may take longer to solve
                  </p>
                )}
              </div>
            )}

            {appState.mode === 'single' && (
              <div className="bg-slate-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Factory className="w-4 h-4 text-blue-400" />
                  <span>Single Facility Mode</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Optimizing for one steel production facility
                </p>
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Cpu className="w-4 h-4" />
                Technologies (K): {appState.K}
              </label>
              <input
                type="range"
                min="2"
                max="5"
                value={appState.K}
                onChange={(e) => onStateChange({ ...appState, K: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>2</span>
                <span>5</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Clock className="w-4 h-4" />
                Time Periods (T): {appState.T}
              </label>
              <input
                type="range"
                min="2"
                max="8"
                value={appState.T}
                onChange={(e) => onStateChange({ ...appState, T: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>2</span>
                <span>8</span>
              </div>
            </div>

            {appState.mode === 'multi' && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Settings className="w-4 h-4" />
                  Random Seed: {appState.randomSeed}
                </label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={appState.randomSeed}
                  onChange={(e) => onStateChange({ ...appState, randomSeed: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1</span>
                  <span>1000</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  For reproducible random firm attributes
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-700">
          <button
            onClick={onReset}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            Reset to Defaults
          </button>
        </div>

        <div className="pt-4">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-sm font-semibold mb-3">Current Model Size</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Mode:</span>
                <span className="font-mono capitalize">{appState.mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Facilities:</span>
                <span className="font-mono">{appState.E}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Variables:</span>
                <span className="font-mono">{(appState.E * appState.K * appState.T * 3 + appState.E * appState.T * 6).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Constraints:</span>
                <span className="font-mono">{(appState.E * appState.T * 8 + appState.E * appState.K * appState.T * 4).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
