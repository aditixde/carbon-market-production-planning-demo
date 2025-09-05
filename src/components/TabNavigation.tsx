import React from 'react';
import { clsx } from 'clsx';
import { Settings, Play, BarChart3, TrendingUp } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mode: 'single' | 'multi';
}

const baseTabs = [
  { id: 'parameters', label: 'Parameters', icon: Settings },
  { id: 'optimization', label: 'Run Optimization', icon: Play },
  { id: 'results', label: 'Results', icon: BarChart3 },
];

const marketTab = { id: 'market', label: 'Market Simulation', icon: TrendingUp };

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, mode }) => {
  const tabs = mode === 'multi' ? [...baseTabs, marketTab] : baseTabs;

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="flex space-x-8 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200',
                {
                  'border-blue-500 text-blue-600': activeTab === tab.id,
                  'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300': activeTab !== tab.id,
                }
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
