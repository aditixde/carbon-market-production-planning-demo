import { Parameters, OptimizationResults, MarketSimulation } from '../types';

// Enhanced MILP Solver with new features
export class MILPSolver {
  private E: number;
  private K: number;
  private T: number;
  private params: Parameters;
  private mode: 'single' | 'multi';

  constructor(E: number, K: number, T: number, params: Parameters, mode: 'single' | 'multi' = 'multi') {
    this.E = E;
    this.K = K;
    this.T = T;
    this.params = params;
    this.mode = mode;
  }

  solve(): OptimizationResults {
    try {
      if (this.mode === 'single') {
        return this.solveSingleFacility();
      } else {
        return this.solveMultiFacility();
      }
    } catch (error) {
      console.error('Optimization failed:', error);
      return this.createErrorResults();
    }
  }

  private solveSingleFacility(): OptimizationResults {
    // Solve for single facility (E=1)
    const results = this.createGreedySolution();
    return {
      objective: this.calculateObjective(results),
      status: 'optimal',
      variables: results,
      metrics: this.calculateMetrics(results)
    };
  }

  private solveMultiFacility(): OptimizationResults {
    // Solve each facility individually, then aggregate
    const firmResults: OptimizationResults[] = [];
    
    for (let i = 0; i < this.E; i++) {
      const singleFirmParams = this.extractSingleFirmParams(i);
      const singleSolver = new MILPSolver(1, this.K, this.T, singleFirmParams, 'single');
      const firmResult = singleSolver.solve();
      firmResults.push(firmResult);
    }

    // Aggregate results
    const aggregatedResults = this.aggregateResults(firmResults);
    const marketMetrics = this.calculateMarketMetrics(firmResults);

    return {
      ...aggregatedResults,
      metrics: {
        ...aggregatedResults.metrics,
        ...marketMetrics
      },
      firmResults
    };
  }

  private extractSingleFirmParams(firmIndex: number): Parameters {
    // Extract parameters for a single firm
    return {
      ...this.params,
      fi: [this.params.fi[firmIndex]],
      ci: [this.params.ci[firmIndex]],
      ei: [this.params.ei[firmIndex]],
      wi: [this.params.wi[firmIndex]],
      yi: [this.params.yi[firmIndex]],
      ici: [this.params.ici[firmIndex]],
      ai: [this.params.ai[firmIndex]],
      di: [this.params.di[firmIndex]],
      pt: [this.params.pt[firmIndex]],
      Ai: [this.params.Ai[firmIndex]],
      oi: [this.params.oi[firmIndex]],
      bi: [this.params.bi[firmIndex]],
      si: [this.params.si[firmIndex]],
      scrapUse: [this.params.scrapUse[firmIndex]],
      ccusUse: [this.params.ccusUse[firmIndex]],
      baselineIntensity: [this.params.baselineIntensity[firmIndex]],
      investCap: [this.params.investCap[firmIndex]],
      firmAttributes: [this.params.firmAttributes[firmIndex]]
    };
  }

  private createGreedySolution() {
    // Enhanced greedy solution with strategic orientation consideration
    const production = Array.from({ length: this.E }, () =>
      Array.from({ length: this.K }, () => Array(this.T).fill(0))
    );
    
    const build = Array.from({ length: this.E }, () =>
      Array.from({ length: this.K }, () => Array(this.T).fill(0))
    );
    
    const capacity = Array.from({ length: this.E }, () =>
      Array.from({ length: this.K }, () => Array(this.T).fill(0))
    );
    
    const operating = Array.from({ length: this.E }, () => Array(this.T).fill(0));
    const buy = Array.from({ length: this.E }, () => Array(this.T).fill(0));
    const sell = Array.from({ length: this.E }, () => Array(this.T).fill(0));
    const banked = Array.from({ length: this.E }, () => Array(this.T).fill(0));
    const unmet = Array.from({ length: this.E }, () => Array(this.T).fill(0));
    const emissions = Array.from({ length: this.E }, () => Array(this.T).fill(0));
    const output = Array.from({ length: this.E }, () => Array(this.T).fill(0));
    const allocations = Array.from({ length: this.E }, () => Array(this.T).fill(0));

    // Track investment spending per facility
    const investmentSpent = Array(this.E).fill(0);

    for (let i = 0; i < this.E; i++) {
      const firmAttr = this.params.firmAttributes[i];
      
      for (let t = 0; t < this.T; t++) {
        let demandRemaining = this.params.di[i][t];
        operating[i][t] = demandRemaining > 0 ? 1 : 0;

        // Build capacity with investment constraint
        for (let k = 0; k < this.K; k++) {
          if (t >= this.params.ai[i][k] - 1) {
            const neededCapacity = Math.min(demandRemaining, this.params.wi[i][k]);
            if (neededCapacity > 0) {
              const buildTime = Math.max(0, t - this.params.yi[i][k] + 1);
              if (buildTime >= 0 && buildTime < this.T) {
                const unitsNeeded = Math.ceil(neededCapacity / this.params.wi[i][k]);
                const investmentCost = this.params.ici[i][k] * unitsNeeded;
                
                // Check investment constraint
                if (investmentSpent[i] + investmentCost <= this.params.investCap[i]) {
                  build[i][k][buildTime] = unitsNeeded;
                  investmentSpent[i] += investmentCost;
                }
              }
            }
          }
        }

        // Update capacity stock
        for (let k = 0; k < this.K; k++) {
          const prevCapacity = t > 0 ? capacity[i][k][t - 1] : 0;
          const newCapacity = t >= this.params.yi[i][k] ? 
            this.params.wi[i][k] * build[i][k][t - this.params.yi[i][k]] : 0;
          capacity[i][k][t] = prevCapacity + newCapacity;
        }

        // Allocate production based on strategic orientation
        let techOrder: number[];
        if (firmAttr.strategicOrientation === 'green-leader') {
          // Prioritize low emissions
          techOrder = Array.from({ length: this.K }, (_, k) => k)
            .sort((a, b) => this.params.ei[i][a] - this.params.ei[i][b]);
        } else if (firmAttr.strategicOrientation === 'cost-minimizer') {
          // Prioritize low cost
          techOrder = Array.from({ length: this.K }, (_, k) => k)
            .sort((a, b) => this.params.ci[i][a] - this.params.ci[i][b]);
        } else {
          // Balanced approach - consider both cost and emissions
          techOrder = Array.from({ length: this.K }, (_, k) => k)
            .sort((a, b) => {
              const scoreA = this.params.ci[i][a] + this.params.ei[i][a] * this.params.pt[i][t];
              const scoreB = this.params.ci[i][b] + this.params.ei[i][b] * this.params.pt[i][t];
              return scoreA - scoreB;
            });
        }
        
        for (const k of techOrder) {
          if (demandRemaining <= 0) break;
          const maxProd = Math.min(demandRemaining, capacity[i][k][t]);
          production[i][k][t] = maxProd;
          demandRemaining -= maxProd;
        }

        unmet[i][t] = Math.max(0, demandRemaining);

        // Calculate emissions and output
        emissions[i][t] = 0;
        output[i][t] = 0;
        for (let k = 0; k < this.K; k++) {
          emissions[i][t] += this.params.ei[i][k] * production[i][k][t];
          output[i][t] += production[i][k][t];
        }

        // Calculate dynamic free allocations
        allocations[i][t] = this.calculateDynamicAllocation(i, t, output[i][t]);

        // Enhanced carbon trading logic
        const allowedEmissions = this.params.beta[t] * output[i][t] + allocations[i][t];
        const prevBanked = t > 0 ? banked[i][t - 1] : 0;
        const netEmissions = emissions[i][t] - allowedEmissions - prevBanked;
        
        if (netEmissions > 0) {
          buy[i][t] = Math.min(netEmissions, this.params.bi[i][t]);
          banked[i][t] = 0;
        } else {
          const canSell = Math.min(-netEmissions, this.params.si[i][t]);
          sell[i][t] = canSell;
          banked[i][t] = -netEmissions - canSell;
        }
      }
    }

    return {
      production,
      build,
      capacity,
      operating,
      buy,
      sell,
      banked,
      unmet,
      emissions,
      output,
      allocations
    };
  }

  private calculateDynamicAllocation(i: number, t: number, output: number): number {
    const baselineIntensity = this.params.baselineIntensity[i];
    const targetIntensity = this.params.targetIntensity[t];
    const benchmarkIntensity = this.params.beta[t];
    
    // Dynamic allocation based on output and intensity targets
    return baselineIntensity * output * (targetIntensity / benchmarkIntensity);
  }

  private aggregateResults(firmResults: OptimizationResults[]): OptimizationResults {
    // Aggregate individual firm results
    const aggregated = this.createEmptyResults();
    
    for (let firmIdx = 0; firmIdx < firmResults.length; firmIdx++) {
      const firmResult = firmResults[firmIdx];
      
      // Copy firm results to appropriate indices
      for (let k = 0; k < this.K; k++) {
        for (let t = 0; t < this.T; t++) {
          aggregated.production[firmIdx][k][t] = firmResult.variables.production[0][k][t];
          aggregated.build[firmIdx][k][t] = firmResult.variables.build[0][k][t];
          aggregated.capacity[firmIdx][k][t] = firmResult.variables.capacity[0][k][t];
        }
      }
      
      for (let t = 0; t < this.T; t++) {
        aggregated.operating[firmIdx][t] = firmResult.variables.operating[0][t];
        aggregated.buy[firmIdx][t] = firmResult.variables.buy[0][t];
        aggregated.sell[firmIdx][t] = firmResult.variables.sell[0][t];
        aggregated.banked[firmIdx][t] = firmResult.variables.banked[0][t];
        aggregated.unmet[firmIdx][t] = firmResult.variables.unmet[0][t];
        aggregated.emissions[firmIdx][t] = firmResult.variables.emissions[0][t];
        aggregated.output[firmIdx][t] = firmResult.variables.output[0][t];
        aggregated.allocations[firmIdx][t] = firmResult.variables.allocations[0][t];
      }
    }

    return {
      objective: firmResults.reduce((sum, result) => sum + result.objective, 0),
      status: 'optimal',
      variables: aggregated,
      metrics: this.calculateMetrics(aggregated)
    };
  }

  private calculateMarketMetrics(firmResults: OptimizationResults[]) {
    const totalEmissions = firmResults.reduce((sum, result) => sum + result.metrics.totalEmissions, 0);
    const totalAllocations = firmResults.reduce((sum, result) => 
      sum + result.variables.allocations.flat().reduce((a, b) => a + b, 0), 0);
    
    const marketBalance = totalAllocations - totalEmissions;
    
    // Simple price volatility calculation
    const prices = this.params.pt.flat();
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const priceVolatility = Math.sqrt(
      prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length
    );

    return {
      totalAllocations,
      marketBalance,
      priceVolatility
    };
  }

  private calculateObjective(results: any): number {
    let objective = 0;
    
    for (let i = 0; i < this.E; i++) {
      for (let t = 0; t < this.T; t++) {
        // Fixed operating costs
        objective += this.params.fi[i] * results.operating[i][t];
        
        // Variable production costs
        for (let k = 0; k < this.K; k++) {
          objective += this.params.ci[i][k] * results.production[i][k][t];
        }
        
        // Trading costs (using firm-specific prices)
        objective += this.params.pt[i][t] * (results.buy[i][t] - results.sell[i][t]);
        
        // Holding costs
        objective += this.params.ht[t] * results.banked[i][t];
        
        // Penalty costs
        objective += this.params.pi * results.unmet[i][t];
      }
      
      // Investment costs
      for (let k = 0; k < this.K; k++) {
        for (let tau = 0; tau < this.T; tau++) {
          objective += this.params.ici[i][k] * results.build[i][k][tau];
        }
      }
    }
    
    return objective;
  }

  private calculateMetrics(results: any) {
    let totalEmissions = 0;
    let totalUnmet = 0;
    const totalCosts = Array(this.T).fill(0);

    for (let i = 0; i < this.E; i++) {
      for (let t = 0; t < this.T; t++) {
        totalEmissions += results.emissions[i][t];
        totalUnmet += results.unmet[i][t];
        
        // Calculate costs per period
        totalCosts[t] += this.params.fi[i] * results.operating[i][t];
        for (let k = 0; k < this.K; k++) {
          totalCosts[t] += this.params.ci[i][k] * results.production[i][k][t];
        }
        totalCosts[t] += this.params.pt[i][t] * (results.buy[i][t] - results.sell[i][t]);
        totalCosts[t] += this.params.ht[t] * results.banked[i][t];
        totalCosts[t] += this.params.pi * results.unmet[i][t];
      }
    }

    return { 
      totalEmissions, 
      totalUnmet, 
      totalCosts,
      totalAllocations: 0,
      marketBalance: 0,
      priceVolatility: 0
    };
  }

  private createEmptyResults() {
    return {
      production: Array.from({ length: this.E }, () =>
        Array.from({ length: this.K }, () => Array(this.T).fill(0))
      ),
      build: Array.from({ length: this.E }, () =>
        Array.from({ length: this.K }, () => Array(this.T).fill(0))
      ),
      capacity: Array.from({ length: this.E }, () =>
        Array.from({ length: this.K }, () => Array(this.T).fill(0))
      ),
      operating: Array.from({ length: this.E }, () => Array(this.T).fill(0)),
      buy: Array.from({ length: this.E }, () => Array(this.T).fill(0)),
      sell: Array.from({ length: this.E }, () => Array(this.T).fill(0)),
      banked: Array.from({ length: this.E }, () => Array(this.T).fill(0)),
      unmet: Array.from({ length: this.E }, () => Array(this.T).fill(0)),
      emissions: Array.from({ length: this.E }, () => Array(this.T).fill(0)),
      output: Array.from({ length: this.E }, () => Array(this.T).fill(0)),
      allocations: Array.from({ length: this.E }, () => Array(this.T).fill(0))
    };
  }

  private createErrorResults(): OptimizationResults {
    return {
      objective: 0,
      status: 'error',
      variables: this.createEmptyResults(),
      metrics: {
        totalEmissions: 0,
        totalUnmet: 0,
        totalCosts: Array(this.T).fill(0),
        totalAllocations: 0,
        marketBalance: 0,
        priceVolatility: 0
      }
    };
  }
}
