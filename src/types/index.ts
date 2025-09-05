export interface AppState {
  E: number; // Number of facilities
  K: number; // Number of technologies
  T: number; // Number of time periods
  mode: 'single' | 'multi'; // Operating mode
  randomSeed: number; // For reproducible random generation
}

export interface FirmAttributes {
  planningHorizon: number;
  investibleCapital: number;
  strategicOrientation: 'cost-minimizer' | 'green-leader' | 'balanced';
  baselineIntensity: number;
}

export interface Technology {
  id: number;
  name: string;
  variableCost: number;
  emissionsIntensity: number;
  capacityPerUnit: number;
  gestationPeriod: number;
  investmentCost: number;
  earliestBuild: number;
  scrapUse: number;
  ccusUse: number;
}

export interface Parameters {
  // Fixed operating costs (per facility)
  fi: number[];
  
  // Variable costs (facility x technology)
  ci: number[][];
  
  // Emissions intensity (facility x technology)
  ei: number[][];
  
  // Capacity per unit (facility x technology)
  wi: number[][];
  
  // Gestation periods (facility x technology)
  yi: number[][];
  
  // Investment costs (facility x technology)
  ici: number[][];
  
  // Earliest build periods (facility x technology)
  ai: number[][];
  
  // Demand (facility x time)
  di: number[][];
  
  // Benchmark emissions (per time period)
  beta: number[];
  
  // Carbon prices (facility x time) - now per facility
  pt: number[][];
  
  // Free allocations (facility x time) - now calculated dynamically
  Ai: number[][];
  
  // Holding costs (per time period)
  ht: number[];
  
  // Operating budgets (facility x time)
  oi: number[][];
  
  // Buy caps (facility x time)
  bi: number[][];
  
  // Sell caps (facility x time)
  si: number[][];
  
  // Scrap usage rates (facility x technology)
  scrapUse: number[][];
  
  // CCUS usage rates (facility x technology)
  ccusUse: number[][];
  
  // System scrap availability (per time period)
  St: number[];
  
  // System CCUS capacity (per time period)
  Ut: number[];
  
  // Penalty cost
  pi: number;
  
  // Big-M parameter
  M: number;
  
  // New parameters
  baselineIntensity: number[]; // per facility
  targetIntensity: number[]; // per time period
  investCap: number[]; // per facility
  firmAttributes: FirmAttributes[]; // per facility
  technologies: Technology[]; // configurable technology database
}

export interface OptimizationResults {
  objective: number;
  status: string;
  variables: {
    production: number[][][]; // x[i][k][t]
    build: number[][][]; // build[i][k][tau]
    capacity: number[][][]; // K_cap[i][k][t]
    operating: number[][]; // oper[i][t]
    buy: number[][]; // buy[i][t]
    sell: number[][]; // sell[i][t]
    banked: number[][]; // C[i][t]
    unmet: number[][]; // unmet[i][t]
    emissions: number[][]; // Emis[i][t]
    output: number[][]; // Out[i][t]
    allocations: number[][]; // calculated Ai[i][t]
  };
  metrics: {
    totalEmissions: number;
    totalUnmet: number;
    totalCosts: number[];
    totalAllocations: number;
    marketBalance: number; // surplus/deficit
    priceVolatility: number;
  };
  firmResults?: OptimizationResults[]; // For multi-facility mode
}

export interface MarketSimulation {
  totalEmissions: number;
  totalAllocations: number;
  marketBalance: number;
  priceVolatility: number;
  priceForecasts: number[][];
  aggregateMetrics: {
    avgEmissionsIntensity: number;
    totalInvestment: number;
    technologyMix: { [key: string]: number };
  };
}
