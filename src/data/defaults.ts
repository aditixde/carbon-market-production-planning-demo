import { Parameters, Technology, FirmAttributes } from '../types';

export const TECHNOLOGY_NAMES = [
  'Coal-based Blast Furnace',
  'Electric Arc Furnace with Scrap',
  'Green Hydrogen with CCUS'
];

export const DEFAULT_TECHNOLOGIES: Technology[] = [
  {
    id: 1,
    name: 'Coal-based Blast Furnace',
    variableCost: 50,
    emissionsIntensity: 2.2,
    capacityPerUnit: 1000,
    gestationPeriod: 1,
    investmentCost: 10000,
    earliestBuild: 1,
    scrapUse: 0,
    ccusUse: 0
  },
  {
    id: 2,
    name: 'Electric Arc Furnace with Scrap',
    variableCost: 60,
    emissionsIntensity: 1.0,
    capacityPerUnit: 1000,
    gestationPeriod: 2,
    investmentCost: 15000,
    earliestBuild: 2,
    scrapUse: 1,
    ccusUse: 0
  },
  {
    id: 3,
    name: 'Green Hydrogen with CCUS',
    variableCost: 80,
    emissionsIntensity: 0.5,
    capacityPerUnit: 1000,
    gestationPeriod: 3,
    investmentCost: 20000,
    earliestBuild: 3,
    scrapUse: 0.5,
    ccusUse: 1
  },
  {
    id: 4,
    name: 'Natural Gas-based Direct Reduced Iron (DRI-EAF)',
    variableCost: 70,
    emissionsIntensity: 0.8,
    capacityPerUnit: 1000,
    gestationPeriod: 2,
    investmentCost: 18000,
    earliestBuild: 2,
    scrapUse: 0.2,
    ccusUse: 0
  },
  {
    id: 5,
    name: 'Biomass-Injected Blast Furnace',
    variableCost: 55,
    emissionsIntensity: 1.5,
    capacityPerUnit: 1000,
    gestationPeriod: 1,
    investmentCost: 12000,
    earliestBuild: 1,
    scrapUse: 0.1,
    ccusUse: 0
  }
];

export const createDefaultFirmAttributes = (E: number): FirmAttributes[] => {
  return Array.from({ length: E }, (_, i) => ({
    planningHorizon: 4,
    investibleCapital: 100000 + i * 10000,
    strategicOrientation: i % 3 === 0 ? 'cost-minimizer' : i % 3 === 1 ? 'green-leader' : 'balanced',
    baselineIntensity: 2.5 + (Math.random() - 0.5) * 0.5 // 2.25 to 2.75
  }));
};

export const randomizeFirmAttributes = (E: number, seed: number): FirmAttributes[] => {
  // Simple seeded random number generator
  let random = seed;
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };

  return Array.from({ length: E }, () => ({
    planningHorizon: 4,
    investibleCapital: 50000 + seededRandom() * 150000, // $50k to $200k
    strategicOrientation: (() => {
      const rand = seededRandom();
      return rand < 0.33 ? 'cost-minimizer' : rand < 0.66 ? 'green-leader' : 'balanced';
    })(),
    baselineIntensity: 2.5 * (0.8 + seededRandom() * 0.4) // ±20% of 2.5
  }));
};

export const createDefaultParameters = (E: number, K: number, T: number, mode: 'single' | 'multi' = 'multi', randomSeed?: number): Parameters => {
  // Base values for scaling
  const baseFi = [10000, 12000];
  const baseCi = [
    [50, 60, 80],
    [55, 65, 85]
  ];
  const baseEi = [
    [2.2, 1.0, 0.5],
    [2.2, 1.0, 0.5]
  ];
  const baseWi = 1000;
  const baseYi = [1, 2, 3];
  const baseIci = [
    [10000, 15000, 20000],
    [11000, 16000, 21000]
  ];
  const baseAi = [1, 2, 3];
  const baseDi = [500, 600, 700, 800];
  const baseBeta = [2.0, 1.9, 1.8, 1.7];
  const basePt = [30, 32, 35, 38];
  const baseHt = [1, 1.1, 1.2, 1.3];
  const baseOi = [50000, 55000, 60000, 65000];
  const baseBi = 10000;
  const baseSi = 10000;
  const baseScrapUse = [
    [0, 1, 0.5],
    [0, 1, 0.5]
  ];
  const baseCcusUse = [
    [0, 0, 1],
    [0, 0, 1]
  ];
  const baseSt = [2000, 2200, 2400, 2600];
  const baseUt = [1500, 1600, 1700, 1800];

  // Create firm attributes
  const firmAttributes = mode === 'multi' && randomSeed !== undefined ? 
    randomizeFirmAttributes(E, randomSeed) : 
    createDefaultFirmAttributes(E);

  // Calculate dynamic free allocations (placeholder - will be calculated in solver)
  const calculateFreeAllocations = (i: number, t: number): number => {
    const baselineIntensity = firmAttributes[i]?.baselineIntensity || 2.5;
    const targetIntensity = baseBeta[t % baseBeta.length];
    const estimatedOutput = baseDi[t % baseDi.length];
    return baselineIntensity * estimatedOutput * (targetIntensity / baseBeta[t % baseBeta.length]);
  };

  return {
    fi: Array.from({ length: E }, (_, i) => baseFi[i % baseFi.length]),
    ci: Array.from({ length: E }, (_, i) => 
      Array.from({ length: K }, (_, k) => baseCi[i % baseCi.length][k % baseCi[0].length])
    ),
    ei: Array.from({ length: E }, (_, i) => 
      Array.from({ length: K }, (_, k) => baseEi[i % baseEi.length][k % baseEi[0].length])
    ),
    wi: Array.from({ length: E }, () => 
      Array.from({ length: K }, () => baseWi)
    ),
    yi: Array.from({ length: E }, () => 
      Array.from({ length: K }, (_, k) => baseYi[k % baseYi.length])
    ),
    ici: Array.from({ length: E }, (_, i) => 
      Array.from({ length: K }, (_, k) => baseIci[i % baseIci.length][k % baseIci[0].length])
    ),
    ai: Array.from({ length: E }, () => 
      Array.from({ length: K }, (_, k) => baseAi[k % baseAi.length])
    ),
    di: Array.from({ length: E }, (_, i) => 
      Array.from({ length: T }, (_, t) => baseDi[t % baseDi.length])
    ),
    beta: Array.from({ length: T }, (_, t) => baseBeta[t % baseBeta.length]),
    pt: Array.from({ length: E }, (_, i) => 
      Array.from({ length: T }, (_, t) => basePt[t % basePt.length])
    ),
    Ai: Array.from({ length: E }, (_, i) => 
      Array.from({ length: T }, (_, t) => calculateFreeAllocations(i, t))
    ),
    ht: Array.from({ length: T }, (_, t) => baseHt[t % baseHt.length]),
    oi: Array.from({ length: E }, (_, i) => 
      Array.from({ length: T }, (_, t) => baseOi[t % baseOi.length])
    ),
    bi: Array.from({ length: E }, () => 
      Array.from({ length: T }, () => baseBi)
    ),
    si: Array.from({ length: E }, () => 
      Array.from({ length: T }, () => baseSi)
    ),
    scrapUse: Array.from({ length: E }, (_, i) => 
      Array.from({ length: K }, (_, k) => baseScrapUse[i % baseScrapUse.length][k % baseScrapUse[0].length])
    ),
    ccusUse: Array.from({ length: E }, (_, i) => 
      Array.from({ length: K }, (_, k) => baseCcusUse[i % baseCcusUse.length][k % baseCcusUse[0].length])
    ),
    St: Array.from({ length: T }, (_, t) => baseSt[t % baseSt.length]),
    Ut: Array.from({ length: T }, (_, t) => baseUt[t % baseUt.length]),
    pi: 1000,
    M: 1000000,
    
    // New parameters
    baselineIntensity: firmAttributes.map(attr => attr.baselineIntensity),
    targetIntensity: Array.from({ length: T }, (_, t) => baseBeta[t % baseBeta.length]),
    investCap: firmAttributes.map(attr => attr.investibleCapital),
    firmAttributes,
    technologies: DEFAULT_TECHNOLOGIES.slice(0, K)
  };
};
