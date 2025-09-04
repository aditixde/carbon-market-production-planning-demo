import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { OptimizationResults } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ResultsChartsProps {
  results: OptimizationResults;
  appState: { E: number; K: number; T: number };
}

export const ResultsCharts: React.FC<ResultsChartsProps> = ({ results, appState }) => {
  const { E, K, T } = appState;

  // Prepare data for total costs per period
  const costsChartData = {
    labels: Array.from({ length: T }, (_, t) => `Period ${t + 1}`),
    datasets: [
      {
        label: 'Total Costs',
        data: results.metrics.totalCosts,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Prepare data for emissions vs benchmark
  const emissionsBenchmarkData = {
    labels: Array.from({ length: T }, (_, t) => `Period ${t + 1}`),
    datasets: [
      ...Array.from({ length: E }, (_, i) => ({
        label: `Facility ${i + 1} Emissions`,
        data: results.variables.emissions[i],
        backgroundColor: `hsla(${(i * 360) / E}, 70%, 50%, 0.8)`,
      })),
      {
        label: 'Benchmark × Output',
        data: Array.from({ length: T }, (_, t) => {
          const totalOutput = results.variables.output.reduce((sum, facility) => sum + facility[t], 0);
          return totalOutput * (results as any).benchmarkValues?.[t] || 0; // Simplified
        }),
        type: 'line' as const,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        borderDash: [5, 5],
      },
    ],
  };

  // Prepare data for production share by technology
  const productionShareData = {
    labels: Array.from({ length: K }, (_, k) => `Technology ${k + 1}`),
    datasets: Array.from({ length: E }, (_, i) => {
      const facilityTotal = results.variables.production[i].reduce(
        (total, tech) => total + tech.reduce((sum, val) => sum + val, 0),
        0
      );
      
      return {
        label: `Facility ${i + 1}`,
        data: Array.from({ length: K }, (_, k) => {
          const techTotal = results.variables.production[i][k].reduce((sum, val) => sum + val, 0);
          return facilityTotal > 0 ? (techTotal / facilityTotal) * 100 : 0;
        }),
        backgroundColor: `hsla(${(i * 360) / E}, 70%, 50%, 0.8)`,
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.parsed.toFixed(1)}%`;
          },
        },
      },
    },
  };

  return (
    <div className="grid gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-700">Total Costs Over Time</h3>
        <div className="h-80">
          <Line data={costsChartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Emissions vs Benchmark</h3>
          <div className="h-80">
            <Bar data={emissionsBenchmarkData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Technology Production Share (%)</h3>
          <div className="h-80">
            <Bar data={productionShareData} options={{ ...chartOptions, indexAxis: 'y' as const }} />
          </div>
        </div>
      </div>
    </div>
  );
};