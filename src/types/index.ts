export interface AppState {
  E: number; // Number of facilities
  K: number; // Number of technologies
  T: number; // Number of time periods
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
  
  // Carbon prices (per time period)
  pt: number[];
  
  // Free allocations (facility x time)
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
  };
  metrics: {
    totalEmissions: number;
    totalUnmet: number;
    totalCosts: number[];
  };
}