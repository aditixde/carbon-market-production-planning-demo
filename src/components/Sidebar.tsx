import React from 'react';
import { Settings, Factory, Cpu, Clock } from 'lucide-react';
import { AppState } from '../types';

interface SidebarProps {
  appState: AppState;
  onStateChange: (newState: AppState) => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ appState, onStateChange, onReset }) => {
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
            <h2 className="text-lg font-semibold">Model Configuration</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Factory className="w-4 h-4" />
                Facilities (E): {appState.E}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={appState.E}
                onChange={(e) => onStateChange({ ...appState, E: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1</span>
                <span>5</span>
              </div>
            </div>

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