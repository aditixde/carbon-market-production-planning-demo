import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Factory, BarChart3, AlertTriangle } from 'lucide-react';
import { OptimizationResults } from '../types';
import { Line, Bar, Pie } from 'react-chartjs-2';

interface MarketSimulationTabProps {
  results: OptimizationResults | null;
  appState: { E: number; K: number; T: number };
}

export const MarketSimulationTab: React.FC<MarketSimulationTabProps> = ({ results, appState }) => {
  if (!results || !results.firmResults) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No Market Data Available</h3>
        <p>Run the multi-facility optimization to see market simulation results</p>
      </div>
    );
  }

  const { firmResults } = results;
  const marketBalance = results.metrics.marketBalance;
  const isShort = marketBalance < 0;
  const priceVolatility = results.metrics.priceVolatility;

  // Calculate aggregate metrics
  const totalInvestment = firmResults.reduce((sum, firm) => {
    return sum + firm.variables.build.flat(2).reduce((buildSum, build, idx) => {
      const facilityIdx = Math.floor(idx / (appState.K * appState.T));
      const techIdx = Math.floor((idx % (appState.K * appState.T)) / appState.T);
      // This is simplified - in real implementation, we'd need proper parameter access
      return buildSum + build * 15000; // Average investment cost
    }, 0);
  }, 0);

  // Technology mix across all firms
  const technologyMix: { [key: string]: number } = {};
  firmResults.forEach((firm, firmIdx) => {
    firm.variables.production.forEach((facilityProd, facilityIdx) => {
      facilityProd.forEach((techProd, techIdx) => {
        const techName = `Technology ${techIdx + 1}`;
        const totalProd = techProd.reduce((sum, prod) => sum + prod, 0);
        technologyMix[techName] = (technologyMix[techName] || 0) + totalProd;
      });
    });
  });

  // Strategic orientation distribution
  const strategicMix = {
    'Cost Minimizer': 0,
    'Green Leader': 0,
    'Balanced': 0
  };

  // Simulated price forecasts (simplified)
  const priceForecasts = Array.from({ length: appState.T }, (_, t) => {
    return Array.from({ length: 10 }, (_, scenario) => {
      const basePrice = 30 + t * 2;
      const volatility = priceVolatility * 0.1;
      return basePrice + (Math.random() - 0.5) * volatility * 2;
    });
  });

  // Chart data
  const marketBalanceData = {
    labels: Array.from({ length: appState.T }, (_, t) => `Period ${t + 1}`),
    datasets: [
      {
        label: 'Total Emissions',
        data: Array.from({ length: appState.T }, (_, t) => {
          return firmResults.reduce((sum, firm) => sum + firm.variables.emissions[0][t], 0);
        }),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
      {
        label: 'Total Allocations',
        data: Array.from({ length: appState.T }, (_, t) => {
          return firmResults.reduce((sum, firm) => sum + firm.variables.allocations[0][t], 0);
        }),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      }
    ]
  };

  const priceVolatilityData = {
    labels: Array.from({ length: appState.T }, (_, t) => `Period ${t + 1}`),
    datasets: priceForecasts.map((_, scenario) => ({
      label: scenario === 0 ? 'Price Scenarios' : '',
      data: priceForecasts.map(periodForecasts => periodForecasts[scenario]),
      borderColor: `hsla(${scenario * 36}, 70%, 50%, 0.3)`,
      backgroundColor: 'transparent',
      borderWidth: 1,
      pointRadius: 0,
      showLine: true,
    }))
  };

  const technologyMixData = {
    labels: Object.keys(technologyMix),
    datasets: [{
      data: Object.values(technologyMix),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(245, 158, 11, 0.8)',
      ]
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Market Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Market Simulation Results</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${
              isShort ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {isShort ? (
                <TrendingDown className="w-6 h-6 text-red-600" />
              ) : (
                <TrendingUp className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div className={`text-2xl font-bold mb-1 ${
              isShort ? 'text-red-600' : 'text-green-600'
            }`}>
              {Math.abs(marketBalance).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              {isShort ? 'Deficit (tCO2)' : 'Surplus (tCO2)'}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {priceVolatility.toFixed(2)}
            </div>
            <div className="text-sm text-slate-600">Price Volatility Index</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <Factory className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              ${(totalInvestment / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-slate-600">Total Investment</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {firmResults.length}
            </div>
            <div className="text-sm text-slate-600">Active Firms</div>
          </div>
        </div>
      </div>

      {/* Market Status Alert */}
      {isShort && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-red-800">Carbon Credit Shortage</h4>
          </div>
          <p className="text-sm text-red-700">
            The market is short by {Math.abs(marketBalance).toLocaleString()} tCO2 credits. 
            This may lead to increased carbon prices and compliance challenges.
          </p>
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Market Balance: Emissions vs Allocations</h3>
          <div className="h-80">
            <Bar data={marketBalanceData} options={chartOptions} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Carbon Price Volatility Scenarios</h3>
            <div className="h-80">
              <Line data={priceVolatilityData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    display: false
                  }
                }
              }} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">Technology Mix Across All Firms</h3>
            <div className="h-80">
              <Pie data={technologyMixData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Market Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Firm Performance Distribution</h3>
          <div className="space-y-4">
            {firmResults.slice(0, 10).map((firm, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-medium">Firm {idx + 1}</span>
                <div className="text-right">
                  <div className="text-sm font-medium">${firm.objective.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">Total Cost</div>
                </div>
              </div>
            ))}
            {firmResults.length > 10 && (
              <div className="text-center text-sm text-slate-500 pt-2">
                ... and {firmResults.length - 10} more firms
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Market Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Average Emissions Intensity</h4>
              <p className="text-2xl font-bold text-blue-600">
                {(results.metrics.totalEmissions / firmResults.reduce((sum, firm) => 
                  sum + firm.variables.output.flat().reduce((a, b) => a + b, 0), 0) || 0).toFixed(2)}
              </p>
              <p className="text-sm text-blue-700">tCO2 per unit of output</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Market Efficiency</h4>
              <p className="text-2xl font-bold text-green-600">
                {((1 - results.metrics.totalUnmet / firmResults.reduce((sum, firm) => 
                  sum + firm.variables.output.flat().reduce((a, b) => a + b, 0), 0)) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-green-700">Demand fulfillment rate</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Investment Intensity</h4>
              <p className="text-2xl font-bold text-purple-600">
                ${(totalInvestment / appState.E / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-purple-700">Average per firm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
